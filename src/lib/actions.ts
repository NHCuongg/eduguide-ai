'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/dashboard' })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Email hoặc mật khẩu không chính xác.'
                default:
                    return 'Có lỗi xảy ra, vui lòng thử lại.'
            }
        }
        
        throw error
    }
}
