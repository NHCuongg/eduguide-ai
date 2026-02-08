'use client'

import { useWizardStore } from "@/lib/store"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Wizard() {
    const { currentStep } = useWizardStore()

    return (
        <div className="w-full relative min-h-[500px]">
            {/* Progress Container */}
            <div className="mb-10 max-w-md mx-auto">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-2">
                    <span className={cn(
                        "transition-colors duration-300",
                        currentStep >= 1 ? "text-indigo-600 dark:text-indigo-400 font-extrabold scale-110" : ""
                    )}>Focus</span>
                    <span className={cn(
                        "transition-colors duration-300",
                        currentStep >= 2 ? "text-indigo-600 dark:text-indigo-400 font-extrabold scale-110" : ""
                    )}>Style</span>
                    <span className={cn(
                        "transition-colors duration-300",
                        currentStep >= 3 ? "text-indigo-600 dark:text-indigo-400 font-extrabold scale-110" : ""
                    )}>Review</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-300 dark:border-slate-700">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-indigo-500/50 relative overflow-hidden"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                </div>
            </div>

            {/* Glass Card Container for Steps */}
            <div className="glass-card rounded-3xl p-8 md:p-12">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && <Step1 key="step1" />}
                    {currentStep === 2 && <Step2 key="step2" />}
                    {currentStep === 3 && <Step3 key="step3" />}
                </AnimatePresence>
            </div>
        </div>
    )
}
