import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

// ─── PageHeader ────────────────────────────────────────────────────────────
interface PageHeaderProps {
    eyebrow?: string
    title: ReactNode
    subtitle?: ReactNode
    actions?: ReactNode
    align?: "left" | "center"
    className?: string
}

export function PageHeader({ eyebrow, title, subtitle, actions, align = "left", className }: PageHeaderProps) {
    const alignment = align === "center" ? "items-center text-center" : ""
    return (
        <header className={cn("flex flex-col md:flex-row md:items-end md:justify-between gap-4", className)}>
            <div className={cn("space-y-2", alignment)}>
                {eyebrow ? (
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {eyebrow}
                    </p>
                ) : null}
                <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                {subtitle ? (
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">{subtitle}</p>
                ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2 shrink-0">{actions}</div> : null}
        </header>
    )
}

// ─── SectionTitle ──────────────────────────────────────────────────────────
interface SectionTitleProps {
    eyebrow?: string
    title: ReactNode
    description?: ReactNode
    actions?: ReactNode
    className?: string
}

export function SectionTitle({ eyebrow, title, description, actions, className }: SectionTitleProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end md:justify-between gap-3", className)}>
            <div className="space-y-1">
                {eyebrow ? (
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {eyebrow}
                    </p>
                ) : null}
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h2>
                {description ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
                ) : null}
            </div>
            {actions ? <div className="flex gap-2 shrink-0">{actions}</div> : null}
        </div>
    )
}

// ─── EmptyState ────────────────────────────────────────────────────────────
interface EmptyStateProps {
    icon?: ReactNode
    title: ReactNode
    description?: ReactNode
    actions?: ReactNode
    variant?: "card" | "inline"
    className?: string
}

export function EmptyState({ icon, title, description, actions, variant = "card", className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                "text-center px-6 py-10 md:py-12",
                variant === "card" &&
                    "rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900",
                className
            )}
        >
            {icon ? (
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mb-4">
                    {icon}
                </div>
            ) : null}
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
            {description ? (
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-5">{description}</p>
            ) : null}
            {actions ? <div className="inline-flex flex-wrap gap-2 justify-center">{actions}</div> : null}
        </div>
    )
}

// ─── DotProgress ───────────────────────────────────────────────────────────
interface DotProgressProps {
    total: number
    current: number
    className?: string
}

export function DotProgress({ total, current, className }: DotProgressProps) {
    return (
        <div className={cn("flex items-center justify-center gap-1.5", className)} aria-hidden>
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === current
                            ? "w-6 bg-indigo-500"
                            : i < current
                                ? "w-1.5 bg-emerald-500/60"
                                : "w-1.5 bg-slate-300 dark:bg-slate-700"
                    )}
                />
            ))}
        </div>
    )
}

// ─── StatStrip ─────────────────────────────────────────────────────────────
interface StatItem {
    label: string
    value: ReactNode
    suffix?: string
    progress?: number
}

interface StatStripProps {
    items: StatItem[]
    columns?: 2 | 3 | 4
    className?: string
}

export function StatStrip({ items, columns = 4, className }: StatStripProps) {
    const cols = columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"
    return (
        <div
            className={cn(
                "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800",
                cols,
                className
            )}
        >
            {items.map((item, i) => (
                <div key={i} className="p-5 md:p-6 flex flex-col gap-2">
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {item.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {item.value}
                        </span>
                        {item.suffix ? (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                                {item.suffix}
                            </span>
                        ) : null}
                    </div>
                    {typeof item.progress === "number" ? (
                        <div className="h-1 mt-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all"
                                style={{ width: `${Math.max(0, Math.min(100, item.progress))}%` }}
                            />
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    )
}
