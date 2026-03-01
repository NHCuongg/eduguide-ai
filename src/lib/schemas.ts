import { z } from "zod"

export const onboardingSchema = z.object({
    targetSkill: z.string().min(2, "Skill must be at least 2 characters"),
    currentLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
    learningStyle: z.enum(["Reading", "Hands-on"]),
    availability: z.number().min(1, "Must have at least 1 hour available").max(168),
    deadline: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Deadline must be in the future",
    }),
    primaryGoal: z.enum(["Career Change", "Skill Improvement", "Academic", "Hobby", "Other"]),
    interests: z.array(z.string()).min(1, "Select at least one interest"),
    contentPreference: z.enum(["Text", "Interactive", "Mixed"]),
    background: z.string().optional(),
    strengths: z.string().optional(),
    weaknesses: z.string().optional(),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
