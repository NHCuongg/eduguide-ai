'use client'

import { useWizardStore } from "@/lib/store"
import Step1 from "./Step1"
import Step2 from "./Step2"
import StepGoals from "./StepGoals"
import StepInterests from "./StepInterests"
import StepContent from "./StepContent"
import Step3 from "./Step3"
import StepBackground from "./StepBackground"
import { AnimatePresence, motion } from "framer-motion"

const STEP_LABELS = [
    "Subject",
    "Schedule",
    "Background",
    "Goal",
    "Interests",
    "Format",
    "Review",
]

export default function Wizard() {
    const { currentStep } = useWizardStore()
    const totalSteps = STEP_LABELS.length
    const safeStep = Math.min(Math.max(currentStep, 1), totalSteps)
    const progress = (safeStep / totalSteps) * 100

    return (
        <div className="space-y-10">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Step {safeStep} of {totalSteps}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                        {STEP_LABELS[safeStep - 1]}
                    </p>
                </div>
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-10">
                <AnimatePresence mode="wait">
                    {safeStep === 1 && <Step1 key="step1" />}
                    {safeStep === 2 && <Step2 key="step2" />}
                    {safeStep === 3 && <StepBackground key="step3_bg" />}
                    {safeStep === 4 && <StepGoals key="step4" />}
                    {safeStep === 5 && <StepInterests key="step5" />}
                    {safeStep === 6 && <StepContent key="step6" />}
                    {safeStep === 7 && <Step3 key="step7" />}
                </AnimatePresence>
            </div>
        </div>
    )
}
