'use client'

import Link from "next/link"
import { useMemo, useState } from "react"
import { Plus, Search, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { RoadmapSummary } from "@/lib/db/roadmaps"
import { CourseCardActions } from "./CourseCardActions"
import { CourseCover } from "./CourseCover"

type Filter = "all" | "active" | "archived" | "completed"

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

function StatusBadge({ status }: { status: RoadmapSummary["status"] }) {
    const styles: Record<RoadmapSummary["status"], string> = {
        active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        completed: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
        archived: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    }
    const label: Record<RoadmapSummary["status"], string> = {
        active: "Active",
        completed: "Completed",
        archived: "Archived",
    }
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${styles[status]}`}>
            {label[status]}
        </span>
    )
}

export function CoursesView({ courses }: { courses: RoadmapSummary[] }) {
    const [filter, setFilter] = useState<Filter>("all")
    const [query, setQuery] = useState("")

    const counts = useMemo(() => {
        return {
            all: courses.length,
            active: courses.filter((c) => c.status === "active").length,
            archived: courses.filter((c) => c.status === "archived").length,
            completed: courses.filter((c) => c.status === "completed").length,
        }
    }, [courses])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return courses.filter((c) => {
            if (filter !== "all" && c.status !== filter) return false
            if (!q) return true
            return c.title.toLowerCase().includes(q)
        })
    }, [courses, filter, query])

    const active = filtered.find((c) => c.status === "active") ?? null
    const others = filtered.filter((c) => c.id !== active?.id)

    if (courses.length === 0) {
        return <FullEmptyState />
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <Tabs filter={filter} onChange={setFilter} counts={counts} />
                <div className="relative w-full md:w-72">
                    <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search courses…"
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

            {active && filter !== "archived" && filter !== "completed" ? (
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Continue learning
                    </h2>
                    <ActiveCard course={active} />
                </section>
            ) : null}

            {others.length > 0 ? (
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {filter === "all" ? "All courses" : filter === "archived" ? "Archived" : filter === "completed" ? "Completed" : "Other courses"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {others.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </section>
            ) : null}

            {filtered.length === 0 ? (
                <FilteredEmptyState query={query} filter={filter} />
            ) : null}
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
    counts: { all: number; active: number; archived: number; completed: number }
}) {
    const items: Array<{ id: Filter; label: string; count: number }> = [
        { id: "all", label: "All", count: counts.all },
        { id: "active", label: "Active", count: counts.active },
        { id: "completed", label: "Completed", count: counts.completed },
        { id: "archived", label: "Archived", count: counts.archived },
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

function ActiveCard({ course }: { course: RoadmapSummary }) {
    const progress = course.totalModules > 0
        ? Math.round((course.completedModules / course.totalModules) * 100)
        : 0
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid md:grid-cols-[280px_1fr]">
                <div className="md:border-r border-b md:border-b-0 border-slate-200 dark:border-slate-800">
                    <CourseCover id={course.id} title={course.title} aspect="4/3" />
                </div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                            <StatusBadge status={course.status} />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Created {formatDate(course.createdAt)}
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-2 line-clamp-2">
                            {course.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                            {course.totalModules} mô-đun · {course.completedModules} đã hoàn thành
                        </p>
                        <div className="space-y-2 max-w-sm">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end shrink-0">
                        <Button asChild className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold h-11 px-5">
                            <Link href="/dashboard">Resume</Link>
                        </Button>
                        <CourseCardActions courseId={course.id} status={course.status} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function CourseCard({ course }: { course: RoadmapSummary }) {
    const progress = course.totalModules > 0
        ? Math.round((course.completedModules / course.totalModules) * 100)
        : 0
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
            <CourseCover id={course.id} title={course.title} />
            <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={course.status} />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{formatDate(course.createdAt)}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight line-clamp-2 leading-snug">
                    {course.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                    {course.totalModules} mô-đun · {course.completedModules} hoàn thành
                </p>
                <div className="mt-auto space-y-2">
                    <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>{progress}%</span>
                        <CourseCardActions courseId={course.id} status={course.status} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function FilteredEmptyState({ query, filter }: { query: string; filter: Filter }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                Không có khóa học phù hợp
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                {query
                    ? `Không có kết quả cho "${query}".`
                    : `Chưa có khóa nào ở trạng thái "${filter}".`}
            </p>
        </div>
    )
}

function FullEmptyState() {
    return (
        <section className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mb-5">
                <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Chưa có khóa học nào</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                Tạo khóa học đầu tiên — chúng tôi sẽ thiết kế lộ trình theo trình độ, mục tiêu và quỹ thời gian của bạn.
            </p>
            <Button asChild className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold h-11 px-5">
                <Link href="/onboarding?fresh=1">
                    <Plus className="w-4 h-4 mr-2" /> Tạo khóa học đầu tiên
                </Link>
            </Button>
        </section>
    )
}
