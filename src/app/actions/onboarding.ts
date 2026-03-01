'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { profiles, roadmaps, studyModules } from "@/lib/db/schema"
import { OnboardingData } from "@/lib/schemas"
import { Roadmap } from "@/lib/types"

export async function saveOnboardingData(onboardingData: OnboardingData, roadmapData: Roadmap) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const userId = session.user.id

        await db.insert(profiles).values({
            userId,
            targetSkill: onboardingData.targetSkill,
            currentLevel: onboardingData.currentLevel,
            onboardingData: onboardingData,
        }).onConflictDoUpdate({
            target: profiles.userId,
            set: {
                targetSkill: onboardingData.targetSkill,
                currentLevel: onboardingData.currentLevel,
                onboardingData: onboardingData,
                updatedAt: new Date()
            }
        })

        const [insertedRoadmap] = await db.insert(roadmaps).values({
            userId,
            title: roadmapData.title,
            content: roadmapData, 
            status: "active"
        }).returning({ id: roadmaps.id })

        if (!insertedRoadmap) {
            throw new Error("Failed to create roadmap record")
        }

        const newRoadmapId = insertedRoadmap.id

        const modulesToInsert = []
        let globalModuleIndex = 0

        for (let p = 0; p < roadmapData.phases.length; p++) {
            const phase = roadmapData.phases[p]
            for (let m = 0; m < phase.modules.length; m++) {
                const module = phase.modules[m]
                modulesToInsert.push({
                    roadmapId: newRoadmapId,
                    moduleIndex: globalModuleIndex,
                    title: module.title,
                    isCompleted: false,
                })
                globalModuleIndex++
            }
        }

        if (modulesToInsert.length > 0) {
            await db.insert(studyModules).values(modulesToInsert)
        }

        return { success: true, roadmapId: newRoadmapId }

    } catch (error) {
        console.error("Error saving onboarding data:", error)
        return { success: false, error: "Internal Server Error" }
    }
}
