import { auth } from "@/auth"
import { createGeneratorRoute } from "@/lib/api-generator"
import { FLASHCARDS_JOB_SPEC } from "@/lib/jobs/specs"
import { buildFlashcardPrompt } from "@/lib/prompts"
import { z } from "zod"

const flashcardRequestSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required"),
  context: z.string().trim().optional(),
})

export const POST = createGeneratorRoute({
  ...FLASHCARDS_JOB_SPEC,
  inputSchema: flashcardRequestSchema,
  invalidRequestMessage: "Invalid flashcard request",
  logLabel: "Flashcards",
  requireAuth: async () => {
    const session = await auth()
    return session?.user ? { allowed: true, userId: session.user.id } : { allowed: false }
  },
  buildCachePayload: ({ topic, context }) => ({ topic, context: context || "" }),
  buildUserPrompt: buildFlashcardPrompt,
})
