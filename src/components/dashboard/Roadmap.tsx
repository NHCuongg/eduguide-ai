'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useWizardStore } from "@/lib/store"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, ExternalLink, Target, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function RoadmapSkeleton() {
    return (
        <div className="space-y-12 py-8" aria-hidden="true">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-28 w-full md:w-[300px] rounded-xl" />
            </div>

            <div className="relative border-l border-zinc-800 ml-4 space-y-12">
                {[0, 1, 2].map((phaseIdx) => (
                    <div key={phaseIdx} className="pl-8 relative">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-zinc-900 border border-indigo-500 ring-4 ring-zinc-900" />
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-8 w-48" />
                            </div>
                            <Skeleton className="h-4 w-full max-w-md" />
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {[0, 1, 2].map((m) => (
                                    <Skeleton key={m} className="h-48 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function RoadmapEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/40">
                <Compass className="h-8 w-8 text-indigo-400" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-white">No roadmap yet</h2>
                <p className="text-sm text-zinc-400 max-w-sm">
                    Tell us what you want to learn and we&apos;ll build a personalized syllabus.
                </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl">
                <Link href="/onboarding">Start onboarding</Link>
            </Button>
        </div>
    )
}

export default function Roadmap() {
    const { roadmap, completedModules, toggleModule } = useWizardStore()
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    if (!hydrated) {
        return <RoadmapSkeleton />
    }

    if (!roadmap) {
        return <RoadmapEmptyState />
    }

    let missionModule = null
    let missionPhaseIndex = 0

    for (let i = 0; i < roadmap.phases.length; i++) {
        const phase = roadmap.phases[i]
        for (let j = 0; j < phase.modules.length; j++) {
            const mod = phase.modules[j]
            const id = `${i}-${j}`
            if (!completedModules.includes(id)) {
                missionModule = mod
                missionPhaseIndex = i + 1
                break
            }
        }
        if (missionModule) break
    }

    return (
        <div className="space-y-12 py-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">
                        {roadmap.title}
                    </h1>
                    <p className="text-zinc-400">Your custom learning trajectory.</p>
                </div>

                {missionModule && (
                    <div className="w-full md:w-auto min-w-[300px] rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-50" aria-hidden="true">
                            <Target className="h-12 w-12 text-indigo-400" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Today&apos;s Mission</div>
                            <div className="bg-indigo-500/20 text-indigo-300 w-fit px-2 py-0.5 rounded text-[10px] mb-2">Phase {missionPhaseIndex}</div>
                            <div className="font-semibold text-white">{missionModule.title}</div>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{missionModule.description}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative border-l border-zinc-800 ml-4 space-y-12">
                {roadmap.phases.map((phase, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="pl-8 relative"
                    >
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-zinc-900 border border-indigo-500 ring-4 ring-zinc-900" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                                    Phase {i + 1}
                                </span>
                                <h2 className="text-2xl font-bold text-white">{phase.name}</h2>
                            </div>

                            <p className="text-muted-foreground">
                                {phase.goal || `Complete the key modules in ${phase.name}.`}
                            </p>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {phase.modules.map((module, j: number) => {
                                    const moduleId = `${i}-${j}`
                                    const isCompleted = completedModules.includes(moduleId)

                                    return (
                                        <div
                                            key={j}
                                            className={`group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 ${isCompleted
                                                    ? 'border-green-500/50 bg-green-900/10'
                                                    : 'border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/50 hover:bg-zinc-900/80'
                                                }`}
                                        >
                                            <div className={`absolute inset-0 pointer-events-none transition-opacity ${isCompleted ? 'bg-gradient-to-br from-green-500/10 to-transparent opacity-100' : 'bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100'}`} />

                                            <div className="relative space-y-4">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleModule(moduleId)}
                                                    aria-pressed={isCompleted}
                                                    aria-label={`${isCompleted ? 'Mark incomplete' : 'Mark complete'}: ${module.title}`}
                                                    className="w-full text-left flex items-start justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                                                >
                                                    <h3 className={`font-semibold text-lg transition-colors ${isCompleted ? 'text-green-400' : 'text-white group-hover:text-indigo-400'}`}>
                                                        {module.title}
                                                    </h3>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-1" aria-hidden="true" />
                                                    ) : (
                                                        <Circle className="h-5 w-5 text-zinc-700 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" aria-hidden="true" />
                                                    )}
                                                </button>

                                                <p className="text-sm text-zinc-400 line-clamp-2">
                                                    {module.description}
                                                </p>

                                                <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/50">
                                                    {module.resources.slice(0, 2).map((res, k: number) => (
                                                        <a
                                                            key={k}
                                                            href={res.url !== "URL or keywords" ? res.url : "#"}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-xs text-indigo-300 hover:text-indigo-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                                                        >
                                                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                                            {res.title}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
