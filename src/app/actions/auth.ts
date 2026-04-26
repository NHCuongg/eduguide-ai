'use server'

import { db } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { inngest } from "@/lib/inngest/client"

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null
    const password = formData.get('password') as string | null

    if (!name || !email || !password) {
        return { error: 'Vui lòng điền đầy đủ các thông tin.' }
    }

    if (password.length < 6) {
        return { error: 'Mật khẩu phải dài tối thiểu 6 ký tự.' }
    }

    try {
        
        const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1)
        if (existingUsers.length > 0) {
            return { error: 'Địa chỉ email này đã được đăng ký.' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword
        })

        try {
            await inngest.send({
                name: "user/signup",
                data: { email, name }
            });
        } catch (inngestError) {
            console.warn('Inngest signup event failed (non-blocking):', inngestError)
        }

    } catch (error: unknown) {
        console.error('Failed to register user:', error)
        if (typeof error === 'object' && error !== null) {
            const err = error as { code?: string, message?: string }
            if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
                return { error: 'Không thể kết nối đến máy chủ CSDL. Vui lòng thử lại sau.' };
            }
        }
        return { error: 'Đăng ký thất bại. Xin vui lòng thử lại sau.' }
    }

    try {
        await signIn('credentials', { email, password, redirectTo: '/onboarding' })
        return { success: true }
    } catch (authError) {
        
        if (authError && typeof authError === 'object' && 'message' in authError && authError.message === 'NEXT_REDIRECT') {
            throw authError; 
        }
        console.error("Auto-login error:", authError)
        return { error: 'Bản ghi đã được tạo tuy nhiên tự động đăng nhập thất bại. Xin vui lòng quay lại trang Sign In.' }
    }
}

export async function sendResetPasswordEmail(formData: FormData) {
    const email = formData.get('email') as string | null

    if (!email) {
        return { error: 'Vui lòng cung cấp địa chỉ email.' }
    }

    try {
        const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1)

        if (existingUsers.length > 0) {
            const token = crypto.randomUUID()
            const expires = new Date(Date.now() + 3600 * 1000)

            await db.insert(verificationTokens).values({
                identifier: email,
                token,
                expires
            })

            await inngest.send({
                name: "user/password-reset",
                data: { email, token }
            })
        }

        return { success: true }
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null) {
            const err = error as { code?: string, message?: string }
            if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
                return { error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' };
            }
        }
        return { error: 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.' }
    }
}

export async function resetPassword(formData: FormData) {
    const token = formData.get('token') as string | null
    const newPassword = formData.get('password') as string | null

    if (!token || !newPassword) {
        return { error: 'Vui lòng cung cấp đầy đủ thông tin.' }
    }

    if (newPassword.length < 6) {
        return { error: 'Mật khẩu phải dài tối thiểu 6 ký tự.' }
    }

    try {
        
        const vt = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token)).limit(1)

        if (vt.length === 0) {
            return { error: 'Liên kết không hợp lệ.' }
        }

        const verificationToken = vt[0]

        if (new Date() > verificationToken.expires) {
            return { error: 'Liên kết khôi phục đã hết hạn.' }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.email, verificationToken.identifier))

        await db.delete(verificationTokens).where(eq(verificationTokens.token, token))

        return { success: true }
    } catch (error: unknown) {
        console.error('Failed to reset password:', error)
        return { error: 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.' }
    }
}
