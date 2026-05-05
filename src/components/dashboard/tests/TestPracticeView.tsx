'use client'

import { useMemo, useState } from "react"
import { Trophy, CheckCircle2, Clock, Search, X, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { QuizModal } from "@/components/dashboard/quiz/QuizModal"

export interface TestModule {
    id: string
    phaseIndex: number
    phaseName: string
    moduleIndex: number
    title: string
    description: string
    estimatedTime: string
    isCompleted: boolean
}

type Filter = "all" | "completed" | "pending"

export function TestPracticeView({
    courseTitle,
    modules,
}: {
    courseTitle: string
    modules: TestModule[]
}) {
    const [filter, setFilter] = useState<Filter>("all")
    const [query, setQuery] = useState("")

    const counts = useMemo(() => {
        return {
            all: modules.length,
            completed: modules.filter((m) => m.isCompleted).length,
            pending: modules.filter((m) => !m.isCompleted).length,
        }
    }, [modules])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return modules.filter((m) => {
            if (filter === "completed" && !m.isCompleted) return false
            if (filter === "pending" && m.isCompleted) return false
            if (!q) return true
            return (
                m.title.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q) ||
                m.phaseName.toLowerCase().includes(q)
            )
        })
    }, [modules, filter, query])

    const focusModule = useMemo(
        () => modules.find((m) => !m.isCompleted) ?? modules[0] ?? null,
        [modules]
    )

    const [randomSeed] = useState(() => Math.floor(Math.random() * 1_000_000))

    const randomModule = useMemo(() => {
        if (modules.length === 0) return null
        return modules[randomSeed % modules.length] ?? null
    }, [modules, randomSeed])

    return (
        <div className="space-y-10">
            {focusModule ? (
                <QuickPracticeCard focusModule={focusModule} randomModule={randomModule} />
            ) : null}

            <section className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    <Tabs filter={filter} onChange={setFilter} counts={counts} />
                    <div className="relative w-full md:w-72">
                        <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search modules…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white"
                        />
                        {query ? (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => setQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        ) : null}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                            Không có mô-đun phù hợp
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {query ? `Không có kết quả cho "${query}".` : "Hãy thử bộ lọc khác."}
                        </p>
                    </div>
                ) : (
                    <ol className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                        {filtered.map((mod, idx) => (
                            <ModuleQuizRow key={mod.id} mod={mod} index={idx} />
                        ))}
                    </ol>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Đang luyện cho khóa <span className="font-semibold text-slate-700 dark:text-slate-200">{courseTitle}</span>.
                </p>
            </section>
        </div>
    )
}

function Tabs({
    filter,
    onChange,
    counts,
}: {
    filter: Filter
    onChange: (f: Filter) => void
    counts: { all: number; completed: number; pending: number }
}) {
    const items: Array<{ id: Filter; label: string; count: number }> = [
        { id: "all", label: "All", count: counts.all },
        { id: "pending", label: "To do", count: counts.pending },
        { id: "completed", label: "Done", count: counts.completed },
    ]
    return (
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 self-start">
            {items.map((item) => {
                const isActive = filter === item.id
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onChange(item.id)}
                        className={cn(
                            "h-9 px-3.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2",
                            isActive
                                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        {item.label}
                        <span
                            className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                isActive
                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            )}
                        >
                            {item.count}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

function QuickPracticeCard({
    focusModule,
    randomModule,
}: {
    focusModule: TestModule
    randomModule: TestModule | null
}) {
    return (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Quick practice
                    </p>
                    <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                        Test what you just learned
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Five questions on your latest unfinished module. Complete it for XP.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                            Phase {focusModule.phaseIndex + 1}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">
                            {focusModule.title}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                    <QuizModal
                        moduleTitle={focusModule.title}
                        trigger={
                            <Button
                                size="lg"
                                className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold h-11 px-5 gap-2"
                            >
                                <Trophy className="w-4 h-4" /> Start practice
                            </Button>
                        }
                    />
                    {randomModule && randomModule.id !== focusModule.id ? (
                        <QuizModal
                            moduleTitle={randomModule.title}
                            trigger={
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-11 px-4 font-semibold gap-2"
                                    title={randomModule.title}
                                >
                                    <Shuffle className="w-4 h-4" /> Random
                                </Button>
                            }
                        />
                    ) : null}
                </div>
            </div>
        </section>
    )
}

function ModuleQuizRow({ mod, index }: { mod: TestModule; index: number }) {
    return (
        <li className="flex flex-col md:flex-row md:items-center gap-4 px-5 md:px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-start gap-4 flex-1 min-w-0">
                <div
                    className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                        mod.isCompleted
                            ? "bg-emerald-500 text-white"
                            : "border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                    )}
                    aria-hidden
                >
                    {mod.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <span className="text-xs font-semibold">{String(index + 1).padStart(2, "0")}</span>
                    )}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4
                            className={cn(
                                "text-base font-semibold tracking-tight",
                                mod.isCompleted
                                    ? "text-slate-500 dark:text-slate-400 line-through"
                                    : "text-slate-900 dark:text-white"
                            )}
                        >
                            {mod.title}
                        </h4>
                        <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                                Phase {mod.phaseIndex + 1}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {mod.estimatedTime}
                            </span>
                        </span>
                    </div>
                    {mod.description ? (
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">
                            {mod.description}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="md:ml-3 shrink-0">
                <QuizModal
                    moduleTitle={mod.title}
                    trigger={
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-lg border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold gap-2"
                        >
                            <Trophy className="w-4 h-4" /> Quiz
                        </Button>
                    }
                />
            </div>
        </li>
    )
}
