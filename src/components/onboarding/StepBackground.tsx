'use client'

import { useWizardStore } from "@/lib/store"
import { Textarea } from "@/components/ui/textarea"
import { StepBody, StepFooter, StepHeading, StepLabel } from "./_StepShell"

export default function StepBackground() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    return (
        <StepBody>
            <StepHeading
                eyebrow="Background"
                title="Tell us about your starting point"
                subtitle="Tuỳ chọn — càng cụ thể, lộ trình càng cá nhân hoá. Mỗi mục tối đa 500 ký tự."
            />

            <div>
                <StepLabel>Background &amp; experience</StepLabel>
                <Textarea
                    placeholder="e.g. Marketer 3 năm, muốn chuyển sang data analysis…"
                    value={data.background || ""}
                    onChange={(e) => setData({ background: e.target.value })}
                    rows={3}
                    maxLength={500}
                    className="resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white text-sm leading-relaxed"
                />
            </div>

            <div>
                <StepLabel>Strengths</StepLabel>
                <Textarea
                    placeholder="e.g. Học nhanh, tư duy logic, trình bày tốt…"
                    value={data.strengths || ""}
                    onChange={(e) => setData({ strengths: e.target.value })}
                    rows={2}
                    maxLength={500}
                    className="resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white text-sm leading-relaxed"
                />
            </div>

            <div>
                <StepLabel>Areas to improve</StepLabel>
                <Textarea
                    placeholder="e.g. Yếu toán, mất tập trung khi đọc dài…"
                    value={data.weaknesses || ""}
                    onChange={(e) => setData({ weaknesses: e.target.value })}
                    rows={2}
                    maxLength={500}
                    className="resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white text-sm leading-relaxed"
                />
            </div>

            <StepFooter onBack={prevStep} onNext={nextStep} nextLabel="Continue" />
        </StepBody>
    )
}
