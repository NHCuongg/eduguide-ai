import { z } from "zod"

export const onboardingSchema = z.object({
    targetSkill: z.string().min(2, "Skill must be at least 2 characters"),
    currentLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
    learningStyle: z.enum(["Visual", "Reading", "Hands-on"]),
    availability: z.number().min(1, "Must have at least 1 hour available").max(168),
    deadline: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Deadline must be in the future",
    }),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
