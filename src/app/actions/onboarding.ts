'use server'

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { profiles, roadmaps, studyModules } from "@/lib/db/schema"
import { OnboardingData } from "@/lib/schemas"
import { Roadmap } from "@/lib/types"

const RECENT_INSERT_WINDOW_MS = 5_000

async function persistRoadmap(
    userId: string,
    onboardingData: OnboardingData,
    roadmapData: Roadmap,
    options: { upsertProfile: boolean }
) {
    return db.transaction(async (tx) => {
        if (options.upsertProfile) {
            await tx.insert(profiles).values({
                userId,
                targetSkill: onboardingData.targetSkill,
                currentLevel: onboardingData.currentLevel,
                onboardingData,
            }).onConflictDoUpdate({
                target: profiles.userId,
                set: {
                    targetSkill: onboardingData.targetSkill,
                    currentLevel: onboardingData.currentLevel,
                    onboardingData,
                    updatedAt: new Date(),
                },
            })
        }

        // Archive prior active roadmap(s) for this user
        await tx
            .update(roadmaps)
            .set({ status: "archived", updatedAt: new Date() })
            .where(and(eq(roadmaps.userId, userId), eq(roadmaps.status, "active")))

        const [insertedRoadmap] = await tx
            .insert(roadmaps)
            .values({
                userId,
                title: roadmapData.title,
                content: roadmapData,
                status: "active",
            })
            .returning({ id: roadmaps.id })

        if (!insertedRoadmap) {
            throw new Error("Failed to create roadmap record")
        }

        const modulesToInsert = []
        let globalModuleIndex = 0
        for (let p = 0; p < roadmapData.phases.length; p++) {
            const phase = roadmapData.phases[p]
            for (let m = 0; m < phase.modules.length; m++) {
                modulesToInsert.push({
                    roadmapId: insertedRoadmap.id,
                    moduleIndex: globalModuleIndex,
                    title: phase.modules[m].title,
                    isCompleted: false,
                })
                globalModuleIndex++
            }
        }
        if (modulesToInsert.length > 0) {
            await tx.insert(studyModules).values(modulesToInsert)
        }

        return insertedRoadmap.id
    })
}

async function isDoubleSubmit(userId: string): Promise<boolean> {
    const [latest] = await db
        .select({ createdAt: roadmaps.createdAt })
        .from(roadmaps)
        .where(eq(roadmaps.userId, userId))
        .orderBy(roadmaps.createdAt)
        .limit(1)
    if (!latest) return false
    return Date.now() - latest.createdAt.getTime() < RECENT_INSERT_WINDOW_MS
}

export async function saveOnboardingData(onboardingData: OnboardingData, roadmapData: Roadmap) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const userId = session.user.id

        if (await isDoubleSubmit(userId)) {
            return { success: false, error: "Yêu cầu đang được xử lý. Vui lòng đợi vài giây trước khi thử lại." }
        }

        const newRoadmapId = await persistRoadmap(userId, onboardingData, roadmapData, { upsertProfile: true })
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/courses")
        return { success: true, roadmapId: newRoadmapId }
    } catch (error) {
        console.error("Error saving onboarding data:", error)
        return { success: false, error: "Internal Server Error" }
    }
}

export async function createNewRoadmap(onboardingData: OnboardingData, roadmapData: Roadmap) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }
        const userId = session.user.id

        if (await isDoubleSubmit(userId)) {
            return { success: false, error: "Yêu cầu đang được xử lý. Vui lòng đợi vài giây." }
        }

        const newRoadmapId = await persistRoadmap(userId, onboardingData, roadmapData, { upsertProfile: false })
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/courses")
        return { success: true, roadmapId: newRoadmapId }
    } catch (error) {
        console.error("Error creating new roadmap:", error)
        return { success: false, error: "Internal Server Error" }
    }
}

export async function setActiveRoadmap(roadmapId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }
        const userId = session.user.id

        await db.transaction(async (tx) => {
            const [exists] = await tx
                .select({ id: roadmaps.id })
                .from(roadmaps)
                .where(and(eq(roadmaps.userId, userId), eq(roadmaps.id, roadmapId)))
                .limit(1)
            if (!exists) {
                throw new Error("Roadmap not found")
            }

            await tx
                .update(roadmaps)
                .set({ status: "archived", updatedAt: new Date() })
                .where(and(eq(roadmaps.userId, userId), eq(roadmaps.status, "active")))

            await tx
                .update(roadmaps)
                .set({ status: "active", updatedAt: new Date() })
                .where(and(eq(roadmaps.userId, userId), eq(roadmaps.id, roadmapId)))
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/courses")
        return { success: true }
    } catch (error) {
        console.error("Error setting active roadmap:", error)
        return { success: false, error: "Internal Server Error" }
    }
}

export async function deleteRoadmap(roadmapId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }
        const userId = session.user.id

        const result = await db
            .delete(roadmaps)
            .where(and(eq(roadmaps.userId, userId), eq(roadmaps.id, roadmapId)))
            .returning({ id: roadmaps.id })

        if (result.length === 0) {
            return { success: false, error: "Không tìm thấy khóa học." }
        }

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/courses")
        return { success: true }
    } catch (error) {
        console.error("Error deleting roadmap:", error)
        return { success: false, error: "Internal Server Error" }
    }
}
