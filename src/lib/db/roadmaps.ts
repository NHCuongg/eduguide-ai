import { and, desc, eq, inArray } from "drizzle-orm"
import type { OnboardingData } from "../schemas"
import type { Roadmap } from "../types"
import { db } from "./index"
import { profiles, roadmaps, studyModules } from "./schema"

export interface ActiveRoadmapResult {
    id: string
    title: string
    content: Roadmap
    completedModuleIds: string[]
    onboardingData: Partial<OnboardingData> | null
    targetSkill: string | null
    currentLevel: string | null
}

export interface RoadmapSummary {
    id: string
    title: string
    status: "active" | "completed" | "archived"
    createdAt: Date
    totalModules: number
    completedModules: number
    targetSkill: string | null
    content: Roadmap
}

function buildFlatModuleIds(content: Roadmap): string[] {
    const ids: string[] = []
    for (let p = 0; p < content.phases.length; p++) {
        const phase = content.phases[p]
        for (let m = 0; m < phase.modules.length; m++) {
            ids.push(`${p}-${m}`)
        }
    }
    return ids
}

export async function getActiveRoadmap(userId: string): Promise<ActiveRoadmapResult | null> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)

    const [roadmapRow] = await db
        .select()
        .from(roadmaps)
        .where(and(eq(roadmaps.userId, userId), eq(roadmaps.status, "active")))
        .orderBy(desc(roadmaps.createdAt))
        .limit(1)

    if (!roadmapRow) return null

    const content = roadmapRow.content as Roadmap
    const flatIds = buildFlatModuleIds(content)

    const moduleRows = await db
        .select({ moduleIndex: studyModules.moduleIndex, isCompleted: studyModules.isCompleted })
        .from(studyModules)
        .where(eq(studyModules.roadmapId, roadmapRow.id))

    const completedModuleIds = moduleRows
        .filter((row) => row.isCompleted)
        .map((row) => flatIds[row.moduleIndex])
        .filter((id): id is string => Boolean(id))

    return {
        id: roadmapRow.id,
        title: roadmapRow.title,
        content,
        completedModuleIds,
        onboardingData: (profile?.onboardingData ?? null) as Partial<OnboardingData> | null,
        targetSkill: profile?.targetSkill ?? null,
        currentLevel: profile?.currentLevel ?? null,
    }
}

export async function getUserRoadmaps(userId: string): Promise<RoadmapSummary[]> {
    const rows = await db
        .select({
            id: roadmaps.id,
            title: roadmaps.title,
            status: roadmaps.status,
            content: roadmaps.content,
            createdAt: roadmaps.createdAt,
        })
        .from(roadmaps)
        .where(eq(roadmaps.userId, userId))
        .orderBy(desc(roadmaps.createdAt))

    if (rows.length === 0) return []

    const ids = rows.map((r) => r.id)
    const allModules = await db
        .select({
            roadmapId: studyModules.roadmapId,
            isCompleted: studyModules.isCompleted,
        })
        .from(studyModules)
        .where(inArray(studyModules.roadmapId, ids))

    return rows.map((row) => {
        const ms = allModules.filter((m) => m.roadmapId === row.id)
        const completed = ms.filter((m) => m.isCompleted).length
        const content = row.content as Roadmap
        const targetSkill = content?.title ?? null
        return {
            id: row.id,
            title: row.title,
            status: row.status as "active" | "completed" | "archived",
            createdAt: row.createdAt,
            totalModules: ms.length,
            completedModules: completed,
            targetSkill,
            content,
        }
    })
}

export async function getRoadmapById(userId: string, roadmapId: string): Promise<ActiveRoadmapResult | null> {
    const [roadmapRow] = await db
        .select()
        .from(roadmaps)
        .where(and(eq(roadmaps.userId, userId), eq(roadmaps.id, roadmapId)))
        .limit(1)
    if (!roadmapRow) return null

    const content = roadmapRow.content as Roadmap
    const flatIds = buildFlatModuleIds(content)
    const moduleRows = await db
        .select({ moduleIndex: studyModules.moduleIndex, isCompleted: studyModules.isCompleted })
        .from(studyModules)
        .where(eq(studyModules.roadmapId, roadmapRow.id))

    const completedModuleIds = moduleRows
        .filter((m) => m.isCompleted)
        .map((m) => flatIds[m.moduleIndex])
        .filter((id): id is string => Boolean(id))

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)

    return {
        id: roadmapRow.id,
        title: roadmapRow.title,
        content,
        completedModuleIds,
        onboardingData: (profile?.onboardingData ?? null) as Partial<OnboardingData> | null,
        targetSkill: profile?.targetSkill ?? null,
        currentLevel: profile?.currentLevel ?? null,
    }
}
