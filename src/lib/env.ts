import { z } from 'zod'

// Environment variables schema
const envSchema = z.object({
    // Next.js
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    
    // NextAuth
    AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
    
    // AI APIs
    OPENAI_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    GOOGLE_API_KEY: z.string().optional(),
})

// Parse and validate environment variables
function getEnv() {
    try {
        return envSchema.parse({
            NODE_ENV: process.env.NODE_ENV,
            AUTH_SECRET: process.env.AUTH_SECRET,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY,
            GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n')
            throw new Error(`Invalid environment variables:\n${missingVars}`)
        }
        throw error
    }
}

export const env = getEnv()
