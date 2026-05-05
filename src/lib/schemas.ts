import { z } from "zod"

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

// Subject is the only hard requirement — without it the AI has nothing to plan
// against. Everything else has a sensible default so the wizard can be skipped
// step-by-step and still produce a reasonable roadmap.
export const onboardingSchema = z.object({
    targetSkill: z.string().trim().min(2, "Subject must be at least 2 characters").max(120, "Subject is too long"),
    currentLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
    learningStyle: z.array(z.enum(["Reading", "Hands-on", "Flashcard"]))
        .max(3)
        .default([]),
    availability: z.number().min(1).max(168).optional(),
    deadline: z.string().refine((date) => {
        if (!date) return true
        const parsed = new Date(date)
        if (Number.isNaN(parsed.getTime())) return false
        const now = Date.now()
        return parsed.getTime() > now && parsed.getTime() <= now + ONE_YEAR_MS
    }, {
        message: "Deadline must be in the future and within 1 year",
    }).optional().or(z.literal("")),
    primaryGoal: z.enum(["Career Change", "Skill Improvement", "Academic", "Hobby", "Other"]).default("Other"),
    interests: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
    contentPreference: z.enum(["Text", "Interactive", "Mixed"]).default("Mixed"),
    background: z.string().trim().max(500, "Keep it under 500 characters").optional(),
    strengths: z.string().trim().max(500, "Keep it under 500 characters").optional(),
    weaknesses: z.string().trim().max(500, "Keep it under 500 characters").optional(),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
