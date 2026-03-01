import { z } from 'zod'

const envSchema = z.object({
    
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),

    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),

    OPENAI_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    GOOGLE_API_KEY: z.string().optional(),
})

function getEnv() {
    try {
        return envSchema.parse({
            NODE_ENV: process.env.NODE_ENV,
            AUTH_SECRET: process.env.AUTH_SECRET,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY,
            GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = JSON.stringify(error.flatten().fieldErrors, null, 2)
            throw new Error(`ENV_ERROR: ${missingVars}`)
        }
        throw error
    }
}

export const env = getEnv()
