'use server'

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { inngest } from "@/lib/inngest/client"

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null
    const password = formData.get('password') as string | null

    if (!name || !email || !password) {
        return { error: 'Missing required fields. Please fill out all fields.' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters long.' }
    }

    try {
        // 1. Check if user already exists
        const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1)
        if (existingUsers.length > 0) {
            return { error: 'An account with this email already exists.' }
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 3. Insert new user into the database
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword
        })

        // 4. Trigger Welcome Email event via Inngest
        await inngest.send({
            name: "user/signup",
            data: { email, name }
        });

    } catch (error: any) {
        console.error('Failed to register user:', error)
        return { error: 'Failed to create user account. Please try again later.' }
    }

    // Attempt to login the user automatically
    try {
        await signIn('credentials', { email, password, redirectTo: '/onboarding' })
        return { success: true }
    } catch (authError: any) {
        // NextJS redirects throw an error that must be re-thrown
        if (authError.message === 'NEXT_REDIRECT') {
            throw authError; // Allow the redirect to happen naturally
        }
        console.error("Auto-login error:", authError)
        return { error: 'Account created, but failed to automatically log in. Please return to login page.' }
    }
}
