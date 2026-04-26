'use server'

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { roadmaps, studyModules } from "@/lib/db/schema"

export interface ToggleModuleInput {
    roadmapId: string
    moduleIndex: number
    isCompleted: boolean
}

export async function setModuleCompletion(input: ToggleModuleInput) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }
        const userId = session.user.id

        // Verify the roadmap belongs to this user.
        const [owned] = await db
            .select({ id: roadmaps.id })
            .from(roadmaps)
            .where(and(eq(roadmaps.userId, userId), eq(roadmaps.id, input.roadmapId)))
            .limit(1)

        if (!owned) {
            return { success: false, error: "Roadmap not found" }
        }

        await db
            .update(studyModules)
            .set({
                isCompleted: input.isCompleted,
                completedAt: input.isCompleted ? new Date() : null,
            })
            .where(
                and(
                    eq(studyModules.roadmapId, input.roadmapId),
                    eq(studyModules.moduleIndex, input.moduleIndex)
                )
            )

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/courses")
        revalidatePath("/dashboard/profile")
        return { success: true }
    } catch (error) {
        console.error("Error setting module completion:", error)
        return { success: false, error: "Internal Server Error" }
    }
}
