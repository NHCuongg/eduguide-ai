'use client';

import { useEffect, useMemo, useCallback, useState, useTransition, Suspense } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useWizardStore } from "@/lib/store"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, CheckCircle2, Plus, Loader2 } from "lucide-react"
import { FadeIn } from "@/components/ui/motion-primitives"
import dynamic from "next/dynamic"
import { ExportButton } from "./export/ExportButton"
import { useGamificationStore, getLevelTitle, getNextLevelXP } from "@/lib/useGamificationStore"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { setModuleCompletion } from "@/app/actions/modules"
import { showToast } from "@/lib/toast"

// Skeleton fallback for study tool sections
function StudyToolSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
            <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
    )
}

const QuizModal = dynamic(() => import("./quiz/QuizModal").then(mod => mod.QuizModal), { ssr: false })
const ResourceModal = dynamic(() => import("./resources/ResourceModal").then(mod => mod.ResourceModal), { ssr: false })
const NotesPanel = dynamic(() => import("./notes/NotesPanel").then(mod => mod.NotesPanel), { ssr: false })

export default function MainContent() {
    const { data, roadmap, activeRoadmapId, completedModules, toggleModule } = useWizardStore()
    const { xp, level, streak, checkStreak, addXP } = useGamificationStore()
    const { data: session } = useSession()
    const t = useTranslations("dashboard")
    const [pendingModuleIds, setPendingModuleIds] = useState<Set<string>>(new Set())
    const [, startTransition] = useTransition()

    const flatModules = useMemo(() => {
        if (!roadmap) return []
        const items: {
            id: string
            phaseIndex: number
            phaseName: string
            globalIndex: number
            title: string
            description: string
            estimatedTime: string
            resources: { title: string; url: string; type: string }[]
        }[] = []
        let globalIndex = 0
        for (let p = 0; p < roadmap.phases.length; p++) {
            const phase = roadmap.phases[p]
            for (let m = 0; m < phase.modules.length; m++) {
                const mod = phase.modules[m]
                items.push({
                    id: `${p}-${m}`,
                    phaseIndex: p,
                    phaseName: phase.name,
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

    const handleToggleModule = useCallback(
        (item: { id: string; globalIndex: number }) => {
            if (!activeRoadmapId) {
                toggleModule(item.id)
                return
            }
            const wasCompleted = completedModules.includes(item.id)
            const nextCompleted = !wasCompleted

            // Optimistic update
            toggleModule(item.id)
            setPendingModuleIds((prev) => new Set(prev).add(item.id))

            startTransition(async () => {
                const result = await setModuleCompletion({
                    roadmapId: activeRoadmapId,
                    moduleIndex: item.globalIndex,
                    isCompleted: nextCompleted,
                })
                setPendingModuleIds((prev) => {
                    const next = new Set(prev)
                    next.delete(item.id)
                    return next
                })
                if (!result.success) {
                    // revert
                    toggleModule(item.id)
                    showToast.error("Không thể lưu tiến độ", result.error ?? "Vui lòng thử lại.")
                    return
                }
                if (nextCompleted) addXP(20)
            })
        },
        [activeRoadmapId, completedModules, toggleModule, addXP]
    )

    const totalModuleCount = flatModules.length
    const completedCount = useMemo(
        () => flatModules.filter((mod) => completedModules.includes(mod.id)).length,
        [flatModules, completedModules]
    )
    const progressByModules = totalModuleCount > 0
        ? Math.round((completedCount / totalModuleCount) * 100)
        : 0

    const nextModules = useMemo(() => {
        const incomplete = flatModules.filter((mod) => !completedModules.includes(mod.id))
        return (incomplete.length > 0 ? incomplete : flatModules).slice(0, 3)
    }, [flatModules, completedModules])

    const progressPercentage = useMemo(() => {
        return Math.min(100, Math.round((xp / getNextLevelXP(level)) * 100))
    }, [xp, level])

    const progressValue = useMemo(() => {
        return (xp / getNextLevelXP(level)) * 100
    }, [xp, level])

    useEffect(() => {
        checkStreak()
    }, [checkStreak])

    if (!data?.targetSkill) {
        return (
            <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6 xl:p-10">
                <div className="max-w-3xl mx-auto py-16 md:py-24 text-center space-y-6">
                    <div className="mx-auto w-12 h-12 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                            {t("empty.title")}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-md mx-auto">
                            {t("empty.subtitle")}
                        </p>
                    </div>
                    <div className="flex justify-center pt-2">
                        <Button asChild className="h-11 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold">
                            <Link href="/onboarding?fresh=1">
                                <Plus className="w-4 h-4 mr-2" /> {t("empty.cta")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 xl:p-10 scroll-smooth">
            <div className="max-w-6xl mx-auto space-y-10">

                {}
                <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {greeting(t)}, {firstName(session?.user?.name) ?? "Learner"}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                            {data.targetSkill ?? t("yourStudies")}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
                            {t("subtitle")}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <ExportButton />
                    </div>
                </FadeIn>

                {}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 grid grid-cols-2 md:grid-cols-4">
                    <Stat label={t("stats.streak")} value={streak} suffix={t("stats.days")} />
                    <Stat label={t("stats.modules")} value={completedCount} suffix={`${t("stats.of")} ${totalModuleCount || 0}`} progress={progressByModules} />
                    <Stat label={t("stats.level")} value={level} suffix={getLevelTitle(level)} />
                    <Stat label={t("stats.xp")} value={xp} suffix={`/ ${getNextLevelXP(level)}`} progress={progressValue} />
                </div>

                {}
                <FadeIn delay={0.1}>
                    <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardContent className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                            <div className="space-y-4 max-w-2xl">
                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">{t("hero.inProgress")}</p>
                                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {roadmap?.title ?? t("hero.fallbackTitle", { subject: data.targetSkill ?? t("yourStudies") })}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-lg">
                                    {t("hero.subtitle")}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    <Button asChild className="h-11 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold">
                                        <Link href="/dashboard/plan">
                                            <Play className="w-4 h-4 mr-2" /> {t("hero.resume")}
                                        </Link>
                                    </Button>
                                    <Button asChild variant="ghost" className="h-11 px-4 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <Link href="/dashboard/courses">{t("hero.allCourses")}</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="52" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="60" cy="60" r="52"
                                        className="stroke-indigo-500"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={2 * Math.PI * 52}
                                        strokeDashoffset={(2 * Math.PI * 52) * (1 - progressPercentage / 100)}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">{progressPercentage}%</span>
                                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{t("hero.complete")}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {}
                <div className="space-y-6">
                    <FadeIn delay={0.25} className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {t("studyTools")}
                        </h3>
                    </FadeIn>
                    <div className="w-full">
                        <ErrorBoundary>
                            <Suspense fallback={<StudyToolSkeleton />}>
                                <NotesPanel />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </div>

                {}
                <div className="space-y-6">
                    <FadeIn delay={0.3} className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {t("learningPath")}
                        </h3>
                        <Link href="/dashboard/plan" className="text-sm text-indigo-600 dark:text-indigo-300 font-semibold hover:underline transition-colors">
                            {t("viewFullCurriculum")}
                        </Link>
                    </FadeIn>

                    {nextModules.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
                            <p className="text-slate-700 dark:text-slate-200 font-semibold mb-2">{t("noModules")}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("subtitle")}</p>
                            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">
                                <Link href="/onboarding?fresh=1">
                                    <Plus className="w-4 h-4 mr-2" /> {t("createRoadmap")}
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <ol className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                            {nextModules.map((mod, idx) => {
                                const isCompleted = completedModules.includes(mod.id)
                                const isCurrent = !isCompleted && idx === 0
                                const isPending = pendingModuleIds.has(mod.id)
                                return (
                                    <li
                                        key={mod.id}
                                        className={[
                                            "flex flex-col md:flex-row md:items-center gap-4 px-5 md:px-6 py-5 transition-colors",
                                            isCurrent ? "bg-indigo-50/50 dark:bg-indigo-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <button
                                                type="button"
                                                aria-label={isCompleted ? "Mark module incomplete" : "Mark module complete"}
                                                aria-pressed={isCompleted}
                                                disabled={isPending}
                                                onClick={() => handleToggleModule(mod)}
                                                className={[
                                                    "h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                                                    isCompleted
                                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                                        : isCurrent
                                                            ? "border-2 border-indigo-500 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                            : "border border-slate-300 dark:border-slate-600 text-slate-400 hover:border-indigo-300 hover:text-indigo-500",
                                                ].join(" ")}
                                            >
                                                {isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : isCompleted ? (
                                                    <CheckCircle2 className="w-4 h-4" />
                                                ) : (
                                                    <span className="text-xs font-semibold">{String(idx + 1).padStart(2, "0")}</span>
                                                )}
                                            </button>

                                            <div className="flex-1 space-y-1 min-w-0">
                                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                    <h4 className={[
                                                        "text-base font-semibold tracking-tight",
                                                        isCompleted
                                                            ? "text-slate-500 dark:text-slate-400 line-through"
                                                            : "text-slate-900 dark:text-white",
                                                    ].join(" ")}>
                                                        {mod.title}
                                                    </h4>
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Phase {mod.phaseIndex + 1}</span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {mod.estimatedTime}
                                                        </span>
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">
                                                    {mod.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 md:ml-3 shrink-0">
                                            <ResourceModal moduleTitle={mod.title} resources={mod.resources} />
                                            <QuizModal moduleTitle={mod.title} />
                                        </div>
                                    </li>
                                )
                            })}
                        </ol>
                    )}
                </div>

            </div>
        </main>
    )
}

function greeting(t: (key: string) => string): string {
    const hour = new Date().getHours()
    if (hour < 12) return t("greetingMorning")
    if (hour < 18) return t("greetingAfternoon")
    return t("greetingEvening")
}

function firstName(fullName: string | null | undefined): string | null {
    if (!fullName) return null
    const trimmed = fullName.trim()
    if (!trimmed) return null
    return trimmed.split(/\s+/)[0]
}

interface StatProps {
    label: string
    value: string | number
    suffix?: string
    progress?: number
}

function Stat({ label, value, suffix, progress }: StatProps) {
    return (
        <div className="p-5 md:p-6 flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label}
            </p>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {value}
                </span>
                {suffix ? (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                        {suffix}
                    </span>
                ) : null}
            </div>
            {typeof progress === "number" ? (
                <Progress
                    value={progress}
                    className="h-1 mt-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"
                    indicatorClassName="bg-indigo-500 rounded-full"
                />
            ) : null}
        </div>
    )
}
