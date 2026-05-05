import { auth } from "@/auth"
import { createGeneratorRoute } from "@/lib/api-generator"
import { ROADMAP_JOB_SPEC } from "@/lib/jobs/specs"
import { buildRoadmapPrompt } from "@/lib/prompts"
import { onboardingSchema } from "@/lib/schemas"
import { z } from "zod"

const ROADMAP_CACHE_TTL = 24 * 60 * 60 * 1000

function buildRoadmapCachePayload(data: z.infer<typeof onboardingSchema>) {
  return {
    targetSkill: data.targetSkill,
    currentLevel: data.currentLevel,
    learningStyle: [...data.learningStyle].sort(),
    availability: data.availability,
    deadline: data.deadline,
    primaryGoal: data.primaryGoal,
    interests: [...data.interests].map((interest) => interest.trim().toLowerCase()).sort(),
    contentPreference: data.contentPreference,
    background: data.background?.trim() || "",
    strengths: data.strengths?.trim() || "",
    weaknesses: data.weaknesses?.trim() || "",
  }
}

export const POST = createGeneratorRoute({
  ...ROADMAP_JOB_SPEC,
  inputSchema: onboardingSchema,
  cacheTtlMs: ROADMAP_CACHE_TTL,
  invalidRequestMessage: "Invalid onboarding data",
  logLabel: "Roadmap",
  scopeByUser: true,
  requireAuth: async () => {
    const session = await auth()
    return session?.user ? { allowed: true, userId: session.user.id } : { allowed: false }
  },
  buildCachePayload: buildRoadmapCachePayload,
  buildUserPrompt: buildRoadmapPrompt,
})
