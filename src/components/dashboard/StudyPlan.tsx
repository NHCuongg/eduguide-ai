'use client'

import { useCallback, useMemo, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Loader2,
    Plus,
    Search,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useWizardStore } from "@/lib/store"
import { setModuleCompletion } from "@/app/actions/modules"
import { useGamificationStore } from "@/lib/useGamificationStore"
import { showToast } from "@/lib/toast"
import { ResourceModal } from "./resources/ResourceModal"
import { QuizModal } from "./quiz/QuizModal"

const TODAY_LIMIT = 5

interface FlatModule {
    id: string
    phaseIndex: number
    phaseName: string
    moduleIndex: number
    globalIndex: number
    title: string
    description: string
    estimatedTime: string
    resources: { title: string; url: string; type: string }[]
}

export default function StudyPlan() {
    const { roadmap, activeRoadmapId, completedModules, toggleModule, setActiveModule, activeModuleId } = useWizardStore()
    const { addXP } = useGamificationStore()

    const [activeTab, setActiveTab] = useState<"today" | "roadmap">("today")
    const [searchQuery, setSearchQuery] = useState("")
    const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
    const [, startTransition] = useTransition()

    const moduleRefs = useRef<Map<string, HTMLLIElement | null>>(new Map())

    const flatModules = useMemo<FlatModule[]>(() => {
        if (!roadmap) return []
        const items: FlatModule[] = []
        let globalIndex = 0
        for (let p = 0; p < roadmap.phases.length; p++) {
            const phase = roadmap.phases[p]
            for (let m = 0; m < phase.modules.length; m++) {
                const mod = phase.modules[m]
                items.push({
                    id: `${p}-${m}`,
                    phaseIndex: p,
                    phaseName: phase.name,
                    moduleIndex: m,
                    globalIndex,
                    title: mod.title,
                    description: mod.description,
                    estimatedTime: mod.estimatedTime,
                    resources: mod.resources,
                })
                globalIndex++
            }
        }
        return items
    }, [roadmap])

    const totalModules = flatModules.length
    const completedCount = useMemo(
        () => flatModules.filter((m) => completedModules.includes(m.id)).length,
        [flatModules, completedModules]
    )
    const progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

    const firstIncomplete = useMemo(
        () => flatModules.find((m) => !completedModules.includes(m.id)) ?? null,
        [flatModules, completedModules]
    )

    const filteredModules = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return flatModules
        return flatModules.filter(
            (m) =>
                m.title.toLowerCase().includes(query) ||
                m.description.toLowerCase().includes(query) ||
                m.phaseName.toLowerCase().includes(query)
        )
    }, [flatModules, searchQuery])

    const todayModules = useMemo(() => {
        const incomplete = filteredModules.filter((m) => !completedModules.includes(m.id))
        return incomplete.slice(0, TODAY_LIMIT)
    }, [filteredModules, completedModules])

    const phaseGroups = useMemo(() => {
        const groups = new Map<number, { phaseName: string; modules: FlatModule[] }>()
        for (const mod of filteredModules) {
            if (!groups.has(mod.phaseIndex)) {
                groups.set(mod.phaseIndex, { phaseName: mod.phaseName, modules: [] })
            }
            groups.get(mod.phaseIndex)!.modules.push(mod)
        }
        return [...groups.entries()].sort(([a], [b]) => a - b)
    }, [filteredModules])

    const handleToggle = useCallback(
        (mod: FlatModule) => {
            const wasCompleted = completedModules.includes(mod.id)
            const nextCompleted = !wasCompleted

            toggleModule(mod.id)

            if (!activeRoadmapId) return
            setPendingIds((prev) => new Set(prev).add(mod.id))
            startTransition(async () => {
                const result = await setModuleCompletion({
                    roadmapId: activeRoadmapId,
                    moduleIndex: mod.globalIndex,
                    isCompleted: nextCompleted,
                })
                setPendingIds((prev) => {
                    const next = new Set(prev)
                    next.delete(mod.id)
                    return next
                })
                if (!result.success) {
                    toggleModule(mod.id)
                    showToast.error("Không thể lưu tiến độ", result.error ?? "Vui lòng thử lại.")
                    return
                }
                if (nextCompleted) addXP(20)
            })
        },
        [activeRoadmapId, completedModules, toggleModule, addXP]
    )

    const handleResume = useCallback(() => {
        if (!firstIncomplete) return
        setActiveModule(firstIncomplete.id)
        setActiveTab("roadmap")
        // Allow tab content to render before scrolling
        requestAnimationFrame(() => {
            const node = moduleRefs.current.get(firstIncomplete.id)
            if (node) {
                node.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        })
    }, [firstIncomplete, setActiveModule])

    if (!roadmap) {
        return <EmptyState />
    }

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
            <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 md:py-10 space-y-8">
                <header className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Study plan
                            </p>
                            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                {roadmap.title}
                            </h1>
                            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                                {totalModules} mô-đun · {completedCount} đã hoàn thành · {progress}%
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleResume}
                                disabled={!firstIncomplete}
                                size="lg"
                            >
                                {firstIncomplete ? "Resume next" : "All done"}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        <Tabs activeTab={activeTab} onChange={setActiveTab} todayCount={todayModules.length} />
                        <div className="relative w-full md:w-72">
                            <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search modules…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white"
                            />
                            {searchQuery ? (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            ) : null}
                        </div>
                    </div>
                </header>

                {activeTab === "today" ? (
                    <TodaySection
                        modules={todayModules}
                        completedSet={completedModules}
                        pendingSet={pendingIds}
                        onToggle={handleToggle}
                        activeModuleId={activeModuleId}
                        moduleRefs={moduleRefs}
                        firstIncompleteId={firstIncomplete?.id ?? null}
                        searchQuery={searchQuery}
                    />
                ) : (
                    <RoadmapSection
                        groups={phaseGroups}
                        completedSet={completedModules}
                        pendingSet={pendingIds}
                        onToggle={handleToggle}
                        activeModuleId={activeModuleId}
                        moduleRefs={moduleRefs}
                        firstIncompleteId={firstIncomplete?.id ?? null}
                        searchQuery={searchQuery}
                    />
                )}
            </div>
        </main>
    )
}

function Tabs({
    activeTab,
    onChange,
    todayCount,
}: {
    activeTab: "today" | "roadmap"
    onChange: (tab: "today" | "roadmap") => void
    todayCount: number
}) {
    return (
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 self-start">
            <button
                type="button"
                onClick={() => onChange("today")}
                className={cn(
                    "h-9 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2",
                    activeTab === "today"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
            >
                Today
                <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    activeTab === "today" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                )}>
                    {todayCount}
                </span>
            </button>
            <button
                type="button"
                onClick={() => onChange("roadmap")}
                className={cn(
                    "h-9 px-4 rounded-lg text-sm font-semibold transition-colors",
                    activeTab === "roadmap"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
            >
                Full roadmap
            </button>
        </div>
    )
}

interface ListProps {
    completedSet: string[]
    pendingSet: Set<string>
    onToggle: (mod: FlatModule) => void
    activeModuleId: string | null
    moduleRefs: React.MutableRefObject<Map<string, HTMLLIElement | null>>
    firstIncompleteId: string | null
    searchQuery: string
}

function TodaySection({ modules, ...props }: { modules: FlatModule[] } & ListProps) {
    if (modules.length === 0) {
        return (
            <EmptySection
                title={props.searchQuery ? "Không tìm thấy mô-đun phù hợp" : "Bạn đã xong việc cho hôm nay"}
                description={props.searchQuery
                    ? `Không có kết quả cho "${props.searchQuery}".`
                    : "Tất cả mô-đun gần nhất đã hoàn thành. Quay lại sau hoặc xem toàn bộ lộ trình."}
            />
        )
    }
    return (
        <section>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Up next
            </p>
            <ol className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                {modules.map((mod, idx) => (
                    <ModuleRow
                        key={mod.id}
                        mod={mod}
                        index={idx}
                        {...props}
                    />
                ))}
            </ol>
        </section>
    )
}

function RoadmapSection({
    groups,
    ...props
}: { groups: [number, { phaseName: string; modules: FlatModule[] }][] } & ListProps) {
    if (groups.length === 0) {
        return (
            <EmptySection
                title="Không có kết quả"
                description={`Không có mô-đun nào khớp với "${props.searchQuery}".`}
            />
        )
    }
    return (
        <div className="space-y-8">
            {groups.map(([phaseIdx, group]) => (
                <section key={phaseIdx}>
                    <div className="flex items-baseline justify-between mb-3">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                            <span className="text-indigo-600 dark:text-indigo-300 mr-2">Phase {phaseIdx + 1}</span>
                            {group.phaseName}
                        </h2>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {group.modules.length} mô-đun
                        </span>
                    </div>
                    <ol className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                        {group.modules.map((mod, idx) => (
                            <ModuleRow
                                key={mod.id}
                                mod={mod}
                                index={idx}
                                {...props}
                            />
                        ))}
                    </ol>
                </section>
            ))}
        </div>
    )
}

interface ModuleRowProps extends ListProps {
    mod: FlatModule
    index: number
}

function ModuleRow({
    mod,
    index,
    completedSet,
    pendingSet,
    onToggle,
    activeModuleId,
    moduleRefs,
    firstIncompleteId,
}: ModuleRowProps) {
    const isCompleted = completedSet.includes(mod.id)
    const isCurrent = !isCompleted && mod.id === firstIncompleteId
    const isFocused = mod.id === activeModuleId
    const isPending = pendingSet.has(mod.id)

    return (
        <li
            ref={(el) => {
                moduleRefs.current.set(mod.id, el)
            }}
            className={cn(
                "flex flex-col md:flex-row md:items-center gap-4 px-5 md:px-6 py-5 transition-colors",
                isFocused
                    ? "bg-indigo-100/50 dark:bg-indigo-900/20"
                    : isCurrent
                        ? "bg-indigo-50/40 dark:bg-indigo-900/10"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
        >
            <div className="flex items-start gap-4 flex-1 min-w-0">
                <button
                    type="button"
                    aria-label={isCompleted ? "Mark module incomplete" : "Mark module complete"}
                    aria-pressed={isCompleted}
                    disabled={isPending}
                    onClick={() => onToggle(mod)}
                    className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                        isCompleted
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : isCurrent
                                ? "border-2 border-indigo-500 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                : "border border-slate-300 dark:border-slate-600 text-slate-400 hover:border-indigo-300 hover:text-indigo-500"
                    )}
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <span className="text-xs font-semibold">{String(index + 1).padStart(2, "0")}</span>
                    )}
                </button>

                <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4
                            className={cn(
                                "text-base font-semibold tracking-tight",
                                isCompleted
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
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                            {mod.description}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="flex items-center gap-2 md:ml-3 shrink-0">
                <ResourceModal moduleTitle={mod.title} resources={mod.resources} />
                <QuizModal moduleTitle={mod.title} />
                {isCurrent ? (
                    <Button
                        size="sm"
                        onClick={() => onToggle(mod)}
                        disabled={isPending}
                        className="hidden md:inline-flex h-9 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold"
                    >
                        Mark done <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                ) : null}
            </div>
        </li>
    )
}

function EmptySection({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">{description}</p>
        </div>
    )
}

function EmptyState() {
    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
            <div className="max-w-2xl mx-auto rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center mt-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mb-5">
                    <Plus className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No roadmap yet</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                    Build your first plan in about two minutes.
                </p>
                <Button asChild size="lg">
                    <Link href="/onboarding?fresh=1">
                        <Plus className="w-4 h-4 mr-2" /> Create roadmap
                    </Link>
                </Button>
            </div>
        </main>
    )
}
