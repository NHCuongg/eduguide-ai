'use client'

import { useEffect } from "react"
import { useWizardStore } from "@/lib/store"
import type { OnboardingData } from "@/lib/schemas"
import type { Roadmap } from "@/lib/types"

export interface DashboardHydratorProps {
    activeRoadmap: {
        id: string
        title: string
        content: Roadmap
        completedModuleIds: string[]
        targetSkill: string | null
        currentLevel: string | null
        onboardingData: Partial<OnboardingData> | null
    } | null
}

export function DashboardHydrator({ activeRoadmap }: DashboardHydratorProps) {
    useEffect(() => {
        if (!activeRoadmap) return

        const data: Partial<OnboardingData> = {
            ...(activeRoadmap.onboardingData ?? {}),
        }
        if (!data.targetSkill && activeRoadmap.targetSkill) {
            data.targetSkill = activeRoadmap.targetSkill
        }
        if (!data.currentLevel && activeRoadmap.currentLevel) {
            data.currentLevel = activeRoadmap.currentLevel as OnboardingData["currentLevel"]
        }

        useWizardStore.getState().hydrateFromServer({
            data,
            roadmap: activeRoadmap.content,
            roadmapId: activeRoadmap.id,
            completedModules: activeRoadmap.completedModuleIds,
        })
    }, [activeRoadmap])

    return null
}
