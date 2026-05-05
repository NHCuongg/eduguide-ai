'use client'

import { useEffect, useRef } from "react"
import { useWizardStore } from "@/lib/store"
import { useGamificationStore } from "@/lib/useGamificationStore"
import { getGamificationState } from "@/app/actions/gamification"
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
    const prewarmedRef = useRef<string | null>(null)
    const gamificationHydratedRef = useRef(false)

    // Hydrate gamification XP/streak from DB (once per mount).
    useEffect(() => {
        if (gamificationHydratedRef.current) return
        gamificationHydratedRef.current = true
        getGamificationState()
            .then((state) => {
                if (state) useGamificationStore.getState().hydrateFromServer(state)
            })
            .catch(() => undefined)
    }, [])

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

        // Pre-warm Quiz + Flashcard cache for the next incomplete module only.
        // Run once per roadmap mount.
        if (prewarmedRef.current === activeRoadmap.id) return
        prewarmedRef.current = activeRoadmap.id

        const completedSet = new Set(activeRoadmap.completedModuleIds)
        const targets: { title: string }[] = []
        outer: for (let p = 0; p < activeRoadmap.content.phases.length; p++) {
            const phase = activeRoadmap.content.phases[p]
            for (let m = 0; m < phase.modules.length; m++) {
                if (completedSet.has(`${p}-${m}`)) continue
                targets.push({ title: phase.modules[m].title })
                if (targets.length >= 1) break outer
            }
        }

        for (const t of targets) {
            void fetch("/api/generate-quiz?async=1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: t.title, skillLevel: "Intermediate" }),
            }).then((r) => r.json()).catch(() => undefined)
            void fetch("/api/generate-flashcards?async=1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: t.title, context: t.title }),
            }).then((r) => r.json()).catch(() => undefined)
        }
    }, [activeRoadmap])

    return null
}
