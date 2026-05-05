import { auth } from "@/auth"
import { createGeneratorRoute } from "@/lib/api-generator"
import { EXERCISE_JOB_SPEC } from "@/lib/jobs/specs"
import { buildExercisePrompt } from "@/lib/prompts"
import { z } from "zod"

const EXERCISE_CACHE_TTL = 24 * 60 * 60 * 1000

const exerciseRequestSchema = z.object({
    topic: z.string().trim().min(1, "Topic is required").max(200),
    moduleTitle: z.string().trim().max(200).optional(),
    skillLevel: z.string().trim().min(1).optional().default("Intermediate"),
})

export const POST = createGeneratorRoute({
    ...EXERCISE_JOB_SPEC,
    inputSchema: exerciseRequestSchema,
    cacheTtlMs: EXERCISE_CACHE_TTL,
    invalidRequestMessage: "Invalid exercise request",
    logLabel: "Exercise",
    requireAuth: async () => {
        const session = await auth()
        return session?.user ? { allowed: true, userId: session.user.id } : { allowed: false }
    },
    buildCachePayload: ({ topic, moduleTitle, skillLevel }) => ({
        topic: topic.trim().toLowerCase(),
        moduleTitle: moduleTitle?.trim().toLowerCase() ?? "",
        skillLevel: skillLevel ?? "Intermediate",
    }),
    buildUserPrompt: buildExercisePrompt,
})
