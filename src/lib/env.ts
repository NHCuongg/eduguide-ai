import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),

    OPENROUTER_API_KEY: z.string().min(1, 'OPENROUTER_API_KEY is required'),
    OPENROUTER_BASE_URL: z.string().url().optional(),
    OPENROUTER_SITE_URL: z.string().url().optional(),
    OPENROUTER_SITE_NAME: z.string().optional(),
    OPENROUTER_MODEL_ROADMAP: z.string().optional(),
    OPENROUTER_MODEL_QUIZ: z.string().optional(),
    OPENROUTER_MODEL_FLASHCARDS: z.string().optional(),
})

function normalize(value: string | undefined): string | undefined {
    if (value === undefined) return undefined
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
}

function getEnv() {
    try {
        return envSchema.parse({
            NODE_ENV: process.env.NODE_ENV,
            AUTH_SECRET: process.env.AUTH_SECRET,
            OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
            OPENROUTER_BASE_URL: normalize(process.env.OPENROUTER_BASE_URL),
            OPENROUTER_SITE_URL: normalize(process.env.OPENROUTER_SITE_URL),
            OPENROUTER_SITE_NAME: process.env.OPENROUTER_SITE_NAME,
            OPENROUTER_MODEL_ROADMAP: process.env.OPENROUTER_MODEL_ROADMAP,
            OPENROUTER_MODEL_QUIZ: process.env.OPENROUTER_MODEL_QUIZ,
            OPENROUTER_MODEL_FLASHCARDS: process.env.OPENROUTER_MODEL_FLASHCARDS,
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
