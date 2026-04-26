import { z } from "zod"

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

export const onboardingSchema = z.object({
    targetSkill: z.string().trim().min(2, "Skill must be at least 2 characters").max(120, "Skill is too long"),
    currentLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
    learningStyle: z.array(z.enum(["Reading", "Hands-on", "Flashcard"]))
        .min(1, "Choose at least one learning style")
        .max(3),
    availability: z.number().min(1, "Must have at least 1 hour available").max(168, "Availability cannot exceed 168h/week"),
    deadline: z.string().refine((date) => {
        const parsed = new Date(date)
        if (Number.isNaN(parsed.getTime())) return false
        const now = Date.now()
        return parsed.getTime() > now && parsed.getTime() <= now + ONE_YEAR_MS
    }, {
        message: "Deadline must be in the future and within 1 year",
    }),
    primaryGoal: z.enum(["Career Change", "Skill Improvement", "Academic", "Hobby", "Other"]),
    interests: z.array(z.string().trim().min(1).max(60)).min(1, "Select at least one interest").max(20, "Too many interests"),
    contentPreference: z.enum(["Text", "Interactive", "Mixed"]),
    background: z.string().trim().max(500, "Keep it under 500 characters").optional(),
    strengths: z.string().trim().max(500, "Keep it under 500 characters").optional(),
    weaknesses: z.string().trim().max(500, "Keep it under 500 characters").optional(),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
