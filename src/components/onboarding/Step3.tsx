'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, RefreshCw, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWizardStore } from "@/lib/store"
import { saveOnboardingData } from "@/app/actions/onboarding"
import type { Roadmap } from "@/lib/types"
import { StepBody, StepHeading } from "./_StepShell"

type Stage = "review" | "preview"

export default function Step3() {
    const { data, prevStep, setRoadmap } = useWizardStore()
    const router = useRouter()

    const [stage, setStage] = useState<Stage>("review")
    const [preview, setPreview] = useState<Roadmap | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generate = async () => {
        setIsGenerating(true)
        setError(null)
        try {
            const response = await fetch("/api/generate-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (response.status === 429) {
                    throw new Error(`Hệ thống đang giới hạn tốc độ. Vui lòng đợi ${errorData.retryAfter || 60} giây.`)
                }
                throw new Error(errorData.error || "Không thể tạo lộ trình từ AI.")
            }
            const roadmapData = (await response.json()) as Roadmap
            setPreview(roadmapData)
            setStage("preview")
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Có lỗi xảy ra. Vui lòng thử lại.")
        } finally {
            setIsGenerating(false)
        }
    }

    const save = async () => {
        if (!preview) return
        setIsSaving(true)
        setError(null)
        try {
            const saveResult = await saveOnboardingData(
                data as Parameters<typeof saveOnboardingData>[0],
                preview
            )
            if (!saveResult.success) {
                throw new Error(saveResult.error || "Không thể lưu vào hệ thống.")
            }
            setRoadmap(preview, saveResult.roadmapId ?? null)
            router.push("/dashboard")
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Có lỗi xảy ra khi lưu.")
        } finally {
            setIsSaving(false)
        }
    }

    const isBusy = isGenerating || isSaving

    if (stage === "preview" && preview) {
        return (
            <StepBody>
                <StepHeading
                    eyebrow="Preview"
                    title={preview.title}
                    subtitle={`${preview.phases.length} giai đoạn · ${preview.phases.reduce((sum, p) => sum + p.modules.length, 0)} mô-đun`}
                />

                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 -mx-1 px-1">
                    {preview.phases.map((phase, p) => (
                        <div
                            key={p}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-4"
                        >
                            <div className="flex items-baseline justify-between gap-3 mb-2">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                                    Phase {p + 1} · {phase.name}
                                </h3>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    {phase.modules.length} mô-đun
                                </span>
                            </div>
                            {phase.goal ? (
                                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">{phase.goal}</p>
                            ) : null}
                            <ul className="space-y-1">
                                {phase.modules.map((mod, m) => (
                                    <li
                                        key={m}
                                        className="flex items-baseline gap-2 text-sm text-slate-700 dark:text-slate-200"
                                    >
                                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] w-6">
                                            {String(m + 1).padStart(2, "0")}
                                        </span>
                                        <span className="font-medium">{mod.title}</span>
                                        <span className="ml-auto text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                                            {mod.estimatedTime}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {error ? (
                    <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-300">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                        <p>{error}</p>
                    </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={generate}
                        disabled={isBusy}
                        className="flex-1 h-11 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2 font-semibold"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Regenerate
                    </Button>
                    <Button
                        type="button"
                        onClick={save}
                        disabled={isBusy}
                        className="flex-1 h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold gap-2"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        Save &amp; open dashboard
                    </Button>
                </div>
            </StepBody>
        )
    }

    return (
        <StepBody>
            <StepHeading
                eyebrow="Review"
                title="Confirm your plan"
                subtitle="Kiểm tra lại trước khi AI thiết kế lộ trình."
            />

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Subject</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight truncate">
                            {data.targetSkill || "—"}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> {data.currentLevel || "Level"}
                        </span>
                    </div>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 text-sm">
                    <Field label="Style" value={(Array.isArray(data.learningStyle) ? data.learningStyle : data.learningStyle ? [data.learningStyle] : []).join(", ") || "—"} />
                    <Field label="Commitment" value={data.availability ? `${data.availability} hrs/week` : "—"} align="right" />
                    <Field label="Format" value={data.contentPreference ?? "—"} />
                    <Field label="Goal" value={data.primaryGoal ?? "—"} align="right" />
                    <Field label="Target" value={data.deadline ?? "—"} />
                    <Field label="Interests" value={(data.interests ?? []).slice(0, 3).join(", ") || "—"} align="right" />
                </dl>
            </div>

            {error ? (
                <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                    <p>{error}</p>
                </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={isBusy}
                    className="h-11 px-4 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                    type="button"
                    onClick={generate}
                    disabled={isBusy}
                    className="h-11 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" /> Generate preview
                        </>
                    )}
                </Button>
            </div>
        </StepBody>
    )
}

function Field({ label, value, align = "left" }: { label: string; value: string | number; align?: "left" | "right" }) {
    return (
        <div className={align === "right" ? "text-right" : ""}>
            <dt className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">{value}</dd>
        </div>
    )
}
