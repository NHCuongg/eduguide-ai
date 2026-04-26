'use client'

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function StepHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
    return (
        <div className="space-y-2">
            {eyebrow ? (
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">{eyebrow}</p>
            ) : null}
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
            {subtitle ? <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
        </div>
    )
}

export function StepBody({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={cn("space-y-8", className)}
        >
            {children}
        </motion.div>
    )
}

export function StepLabel({ children }: { children: ReactNode }) {
    return (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
            {children}
        </label>
    )
}

export function StepFooter({
    onBack,
    onNext,
    nextLabel = "Continue",
    nextDisabled = false,
    isLoading = false,
    showBack = true,
}: {
    onBack?: () => void
    onNext?: () => void
    nextLabel?: string
    nextDisabled?: boolean
    isLoading?: boolean
    showBack?: boolean
}) {
    return (
        <div className="flex items-center justify-between gap-3 pt-4">
            {showBack && onBack ? (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    disabled={isLoading}
                    className="h-11 px-4 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            ) : (
                <div />
            )}
            {onNext ? (
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled || isLoading}
                    className="h-11 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                        {nextLabel}
                        <ArrowRight className="w-4 h-4" />
                    </>}
                </Button>
            ) : null}
        </div>
    )
}

interface ChoiceCardProps {
    label: string
    description?: string
    icon?: ReactNode
    selected: boolean
    onSelect: () => void
    layout?: "row" | "tile"
}

export function ChoiceCard({ label, description, icon, selected, onSelect, layout = "row" }: ChoiceCardProps) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={onSelect}
            className={cn(
                "w-full text-left rounded-xl border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                layout === "tile" ? "p-4 flex flex-col items-center text-center gap-2" : "p-4 flex items-center gap-4",
                selected
                    ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
            )}
        >
            {icon ? (
                <span
                    className={cn(
                        layout === "tile" ? "p-2.5 rounded-xl" : "p-2.5 rounded-lg shrink-0",
                        selected
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    )}
                >
                    {icon}
                </span>
            ) : null}
            <span className={cn("flex-1", layout === "tile" ? "" : "min-w-0")}>
                <span className="block font-semibold text-sm text-slate-900 dark:text-white">{label}</span>
                {description ? (
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</span>
                ) : null}
            </span>
            {layout === "row" ? (
                <span
                    className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        selected
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-slate-300 dark:border-slate-600"
                    )}
                    aria-hidden
                >
                    {selected ? <span className="w-1.5 h-1.5 rounded-full bg-white" /> : null}
                </span>
            ) : null}
        </button>
    )
}
