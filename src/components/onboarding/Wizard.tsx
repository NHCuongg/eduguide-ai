'use client'

import { useWizardStore } from "@/lib/store"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import { AnimatePresence } from "framer-motion"

export default function Wizard() {
    const { currentStep } = useWizardStore()

    return (
        <div className="w-full relative min-h-[500px]">
            {/* Progress Container */}
            <div className="mb-10 max-w-sm mx-auto">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <span className={currentStep >= 1 ? "text-indigo-400" : ""}>Focus</span>
                    <span className={currentStep >= 2 ? "text-indigo-400" : ""}>Style</span>
                    <span className={currentStep >= 3 ? "text-indigo-400" : ""}>Review</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
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
