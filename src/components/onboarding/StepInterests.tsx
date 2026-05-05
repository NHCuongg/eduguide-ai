'use client'

import { useState, type KeyboardEvent } from "react"
import { useWizardStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react"
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

const PRESETS = new Set(OPTIONS.map((o) => o.toLowerCase()))
const MAX_LEN = 60
const MAX_INTERESTS = 20

export default function StepInterests() {
    const { data, setData, nextStep, prevStep } = useWizardStore()
    const selected = data.interests || []
    const [draft, setDraft] = useState("")

    const customs = selected.filter((s) => !PRESETS.has(s.toLowerCase()))

    const togglePreset = (id: string) => {
        if (selected.includes(id)) {
            setData({ interests: selected.filter((i) => i !== id) })
        } else if (selected.length < MAX_INTERESTS) {
            setData({ interests: [...selected, id] })
        }
    }

    const addCustom = () => {
        const value = draft.trim().slice(0, MAX_LEN)
        if (!value) return
        if (selected.length >= MAX_INTERESTS) return
        const exists = selected.some((s) => s.toLowerCase() === value.toLowerCase())
        if (exists) {
            setDraft("")
            return
        }
        setData({ interests: [...selected, value] })
        setDraft("")
    }

    const removeCustom = (value: string) => {
        setData({ interests: selected.filter((s) => s !== value) })
    }

    const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addCustom()
        }
    }

    return (
        <StepBody>
            <StepHeading
                eyebrow="Interests"
                title="What topics excite you?"
                subtitle="Optional — pick any that fit so examples feel relevant."
            />

            <div className="space-y-4">
                <StepLabel>Pick all that apply (optional)</StepLabel>
                <div className="flex flex-wrap gap-2">
                    {OPTIONS.map((opt) => {
                        const isOn = selected.includes(opt)
                        return (
                            <button
                                key={opt}
                                type="button"
                                role="checkbox"
                                aria-checked={isOn}
                                onClick={() => togglePreset(opt)}
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

                <div>
                    <StepLabel>Other (type and press Enter)</StepLabel>
                    <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={onKey}
                        onBlur={addCustom}
                        placeholder="e.g. Astrophotography, Game design, Climbing…"
                        maxLength={MAX_LEN}
                        disabled={selected.length >= MAX_INTERESTS}
                        className="h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-slate-900 dark:focus:border-white"
                    />
                </div>

                {customs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {customs.map((c) => (
                            <span
                                key={c}
                                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full border border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-200 text-sm font-medium"
                            >
                                {c}
                                <button
                                    type="button"
                                    onClick={() => removeCustom(c)}
                                    aria-label={`Remove ${c}`}
                                    className="rounded-full p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selected.length} / {MAX_INTERESTS} selected
                </p>
            </div>

            <StepFooter onBack={prevStep} onNext={nextStep} />
        </StepBody>
    )
}
