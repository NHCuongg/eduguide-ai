'use client'

import { Flame, Target } from "lucide-react"
import { useWizardStore } from "@/lib/store"
import { useGamificationStore, getNextLevelXP } from "@/lib/useGamificationStore"

const DAILY_XP_TARGET = 100

export default function RightWidgets() {
    const { roadmap, completedModules } = useWizardStore()
    const { xp, level, streak } = useGamificationStore()

    const totalModules = roadmap?.phases.reduce((sum, p) => sum + p.modules.length, 0) ?? 0
    const completedCount = completedModules.length
    const progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

    const dailyProgress = Math.min(100, Math.round((xp % DAILY_XP_TARGET) / DAILY_XP_TARGET * 100)) || 0
    const ringRadius = 36
    const ringCircumference = 2 * Math.PI * ringRadius
    const ringOffset = ringCircumference * (1 - dailyProgress / 100)

    return (
        <aside className="w-[300px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 hidden xl:flex flex-col h-[calc(100vh-60px)] gap-6">
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    Today
                </p>
                <div className="flex items-center gap-5">
                    <div className="relative w-[88px] h-[88px] shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88" aria-hidden>
                            <circle cx="44" cy="44" r={ringRadius} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="6" fill="none" />
                            <circle
                                cx="44" cy="44" r={ringRadius}
                                className="stroke-indigo-500"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={ringCircumference}
                                strokeDashoffset={ringOffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                {dailyProgress}%
                            </span>
                            <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Goal</span>
                        </div>
                    </div>
                    <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                            <Target className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {xp % DAILY_XP_TARGET}/{DAILY_XP_TARGET} XP
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span className="font-semibold text-slate-900 dark:text-white">{streak} day streak</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Level {level}</div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
                <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course progress</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                    {completedCount} / {totalModules} mô-đun
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    Level {level} · {xp} / {getNextLevelXP(level)} XP
                </p>
            </section>

        </aside>
    )
}
