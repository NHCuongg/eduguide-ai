'use client'

import { useWizardStore } from "@/lib/store"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, ExternalLink, Target } from "lucide-react"

export default function Roadmap() {
    const { roadmap, completedModules, toggleModule } = useWizardStore()

    if (!roadmap) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <p>No roadmap found. Please complete the onboarding.</p>
            </div>
        )
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
                    <h1 className="text-4xl font-bold tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-600">
                        {roadmap.title}
                    </h1>
                    <p className="text-zinc-400">Your custom learning trajectory.</p>
                </div>

                {missionModule && (
                    <div className="w-full md:w-auto min-w-[300px] rounded-xl border border-primary/30 bg-primary/10 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-50">
                            <Target className="h-12 w-12 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Today&apos;s Mission</div>
                            <div className="bg-primary/20 text-primary w-fit px-2 py-0.5 rounded text-[10px] mb-2">Phase {missionPhaseIndex}</div>
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
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-zinc-900 border border-primary ring-4 ring-zinc-900" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                                    Phase {i + 1}
                                </span>
                                <h2 className="text-2xl font-bold text-white">{phase.name}</h2>
                            </div>

                            <p className="text-muted-foreground">{phase.goal}</p>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {phase.modules.map((module, j: number) => {
                                    const moduleId = `${i}-${j}`
                                    const isCompleted = completedModules.includes(moduleId)

                                    return (
                                        <div
                                            key={j}
                                            onClick={() => toggleModule(moduleId)}
                                            className={`group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 cursor-pointer ${isCompleted
                                                    ? 'border-green-500/50 bg-green-900/10'
                                                    : 'border-zinc-800 bg-zinc-900/50 hover:border-primary/50 hover:bg-zinc-900/80'
                                                }`}
                                        >
                                            <div className={`absolute inset-0 transition-opacity ${isCompleted ? 'bg-gradient-to-br from-green-500/10 to-transparent opacity-100' : 'bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100'}`} />

                                            <div className="relative space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <h3 className={`font-semibold text-lg transition-colors ${isCompleted ? 'text-green-400' : 'text-white group-hover:text-primary'}`}>
                                                        {module.title}
                                                    </h3>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="h-5 w-5 text-zinc-700 group-hover:text-primary transition-colors" />
                                                    )}
                                                </div>

                                                <p className="text-sm text-zinc-400 line-clamp-2">
                                                    {module.description}
                                                </p>

                                                <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/50" onClick={(e) => e.stopPropagation()}>
                                                    {module.resources.slice(0, 2).map((res, k: number) => (
                                                        <a
                                                            key={k}
                                                            href={res.url !== "URL or keywords" ? res.url : "#"}
                                                            target="_blank"
                                                            className="flex items-center gap-2 text-xs text-secondary hover:underline"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
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
