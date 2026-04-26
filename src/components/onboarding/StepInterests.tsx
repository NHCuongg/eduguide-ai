'use client'

import { useWizardStore } from "@/lib/store"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { StepBody, StepFooter, StepHeading, StepLabel } from "./_StepShell"

const OPTIONS = [
    "Tech",
    "Art & Design",
    "Science",
    "Mathematics",
    "History",
    "Music",
    "Languages",
    "Engineering",
    "Business",
    "Health",
    "Philosophy",
    "Sports",
]

export default function StepInterests() {
    const { data, setData, nextStep, prevStep } = useWizardStore()
    const selected = data.interests || []

    const toggle = (id: string) => {
        if (selected.includes(id)) {
            setData({ interests: selected.filter((i) => i !== id) })
        } else if (selected.length < 20) {
            setData({ interests: [...selected, id] })
        }
    }

    return (
        <StepBody>
            <StepHeading
                eyebrow="Interests"
                title="What topics excite you?"
                subtitle="Chọn ít nhất 1 để AI ưu tiên ví dụ và bài tập liên quan."
            />

            <div>
                <StepLabel>Pick all that apply</StepLabel>
                <div className="flex flex-wrap gap-2">
                    {OPTIONS.map((opt) => {
                        const isOn = selected.includes(opt)
                        return (
                            <button
                                key={opt}
                                type="button"
                                role="checkbox"
                                aria-checked={isOn}
                                onClick={() => toggle(opt)}
                                className={cn(
                                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                                    isOn
                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-200"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
                                )}
                            >
                                {isOn ? <Check className="w-3.5 h-3.5" /> : null}
                                {opt}
                            </button>
                        )
                    })}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    {selected.length} đã chọn
                </p>
            </div>

            <StepFooter onBack={prevStep} onNext={nextStep} nextDisabled={selected.length === 0} />
        </StepBody>
    )
}
