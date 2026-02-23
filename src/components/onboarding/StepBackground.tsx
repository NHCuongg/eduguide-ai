'use client'

import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { User, Flame, ShieldAlert } from "lucide-react"

export default function StepBackground() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const handleNext = () => {
        nextStep()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8 max-w-lg mx-auto"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Professional Background</h2>
                <p className="text-slate-500 dark:text-slate-400">Tell us a bit more about yourself to help the AI map your journey better.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex(items-center gap-2">
                        <User className="w-4 h-4 inline-block mr-1 text-indigo-500" />
                        Background & Experience
                    </label>
                    <Textarea
                        placeholder="e.g. I have worked as a marketer for 3 years, but I want to transition to data analysis..."
                        value={data.background || ''}
                        onChange={(e) => setData({ background: e.target.value })}
                        className="h-24 resize-none border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 bg-white dark:bg-slate-900 dark:border-slate-700 font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-green-700 dark:text-green-400">
                        <Flame className="w-4 h-4 inline-block mr-1" />
                        Key Strengths
                    </label>
                    <Textarea
                        placeholder="e.g. Fast learner, good at logic, strong presentation skills..."
                        value={data.strengths || ''}
                        onChange={(e) => setData({ strengths: e.target.value })}
                        className="h-16 resize-none border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-400">
                        <ShieldAlert className="w-4 h-4 inline-block mr-1" />
                        Areas to Improve (Weaknesses)
                    </label>
                    <Textarea
                        placeholder="e.g. Struggle with math, get easily distracted by long texts..."
                        value={data.weaknesses || ''}
                        onChange={(e) => setData({ weaknesses: e.target.value })}
                        className="h-16 resize-none border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/50"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    className="w-1/3 h-12 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    className="w-2/3 h-12 text-base font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                    Continue
                </Button>
            </div>
        </motion.div>
    )
}
