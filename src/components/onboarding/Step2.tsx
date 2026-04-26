'use client'

import { useWizardStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { BookOpen, Hammer, Layers, Clock, Calendar } from "lucide-react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OnboardingData } from "@/lib/schemas"
import { StepBody, StepFooter, StepHeading, StepLabel } from "./_StepShell"

type Style = OnboardingData["learningStyle"][number]

export default function Step2() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const styles: Array<{ id: Style; label: string; desc: string; Icon: typeof BookOpen }> = [
        { id: "Reading", label: "Reading", desc: "Docs & articles", Icon: BookOpen },
        { id: "Hands-on", label: "Hands-on", desc: "Projects & labs", Icon: Hammer },
        { id: "Flashcard", label: "Flashcard", desc: "Spaced repetition", Icon: Layers },
    ]

    const rawStyle = data.learningStyle as Style[] | Style | undefined
    const selectedStyles: Style[] = Array.isArray(rawStyle)
        ? rawStyle
        : rawStyle
            ? [rawStyle]
            : []

    const toggleStyle = (id: Style) => {
        const next = selectedStyles.includes(id)
            ? selectedStyles.filter((s) => s !== id)
            : [...selectedStyles, id]
        setData({ learningStyle: next })
    }

    const canContinue = Boolean(
        selectedStyles.length > 0 && data.availability && data.deadline
    )

    return (
        <StepBody>
            <StepHeading
                eyebrow="Schedule"
                title="When and how will you study?"
                subtitle="Chọn nhiều phương pháp — AI sẽ trộn chúng trong lộ trình."
            />

            <div>
                <StepLabel>Preferred style — pick one or more</StepLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Learning styles">
                    {styles.map(({ id, label, desc, Icon }) => {
                        const isOn = selectedStyles.includes(id)
                        return (
                            <button
                                key={id}
                                type="button"
                                role="checkbox"
                                aria-checked={isOn}
                                onClick={() => toggleStyle(id)}
                                className={cn(
                                    "relative w-full text-left p-4 rounded-xl border transition-colors duration-150",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                                    isOn
                                        ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-900/20"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
                                )}
                            >
                                <span className="flex items-start gap-3">
                                    <span
                                        className={cn(
                                            "p-2.5 rounded-lg shrink-0",
                                            isOn
                                                ? "bg-indigo-500 text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block font-semibold text-sm text-slate-900 dark:text-white">{label}</span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</span>
                                    </span>
                                </span>
                                {isOn ? (
                                    <span
                                        className="absolute top-3 right-3 w-5 h-5 rounded-md bg-indigo-500 text-white flex items-center justify-center"
                                        aria-hidden
                                    >
                                        <Check className="w-3 h-3" />
                                    </span>
                                ) : null}
                            </button>
                        )
                    })}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {selectedStyles.length} đã chọn
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <StepLabel>
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Hours per week
                        </span>
                    </StepLabel>
                    <Input
                        type="number"
                        min={1}
                        max={168}
                        placeholder="e.g. 10"
                        value={data.availability || ""}
                        onChange={(e) => setData({ availability: parseInt(e.target.value) || 0 })}
                        className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white"
                    />
                </div>
                <div>
                    <StepLabel>
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Target date
                        </span>
                    </StepLabel>
                    <Input
                        type="date"
                        value={data.deadline || ""}
                        onChange={(e) => setData({ deadline: e.target.value })}
                        className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <StepFooter onBack={prevStep} onNext={nextStep} nextDisabled={!canContinue} />
        </StepBody>
    )
}
