import { auth } from "@/auth"
import { createGeneratorRoute } from "@/lib/api-generator"
import { QUIZ_JOB_SPEC } from "@/lib/jobs/specs"
import { buildQuizPrompt } from "@/lib/prompts"
import { z } from "zod"

const quizSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required"),
  skillLevel: z.string().trim().min(1).optional().default("Intermediate"),
})

export const POST = createGeneratorRoute({
  ...QUIZ_JOB_SPEC,
  inputSchema: quizSchema,
  invalidRequestMessage: "Invalid quiz request",
  logLabel: "Quiz",
  requireAuth: async () => {
    const session = await auth()
    return session?.user ? { allowed: true, userId: session.user.id } : { allowed: false }
  },
  buildUserPrompt: buildQuizPrompt,
})
