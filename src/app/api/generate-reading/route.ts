import { auth } from "@/auth"
import { createGeneratorRoute } from "@/lib/api-generator"
import { READING_JOB_SPEC } from "@/lib/jobs/specs"
import { buildReadingPrompt } from "@/lib/prompts"
import { z } from "zod"

const READING_CACHE_TTL = 24 * 60 * 60 * 1000

const readingRequestSchema = z.object({
    topic: z.string().trim().min(1, "Topic is required").max(200),
    moduleTitle: z.string().trim().max(200).optional(),
    skillLevel: z.string().trim().min(1).optional().default("Intermediate"),
    interests: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
})

export const POST = createGeneratorRoute({
    ...READING_JOB_SPEC,
    inputSchema: readingRequestSchema,
    cacheTtlMs: READING_CACHE_TTL,
    invalidRequestMessage: "Invalid reading request",
    logLabel: "Reading",
    requireAuth: async () => {
        const session = await auth()
        return session?.user ? { allowed: true, userId: session.user.id } : { allowed: false }
    },
    buildCachePayload: ({ topic, moduleTitle, skillLevel, interests }) => ({
        topic: topic.trim().toLowerCase(),
        moduleTitle: moduleTitle?.trim().toLowerCase() ?? "",
        skillLevel: skillLevel ?? "Intermediate",
        interests: [...(interests ?? [])].map((i) => i.trim().toLowerCase()).sort(),
    }),
    buildUserPrompt: buildReadingPrompt,
})
