'use client'

import { useWizardStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Step1() {
    const { data, setData, nextStep } = useWizardStore()

    const handleNext = () => {
        if (data.targetSkill && data.currentLevel) {
            nextStep()
        }
    }

    const levels = [
        { id: "Beginner", desc: "I'm new to this" },
        { id: "Intermediate", desc: "I know the basics" },
        { id: "Advanced", desc: "I want to master it" }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8 max-w-lg mx-auto"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Focus</h2>
                <p className="text-slate-500 dark:text-slate-400">What do you want to master today?</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Target Subject
                    </label>
                    <Input
                        placeholder="e.g. Molecular Biology, Calculus II..."
                        value={data.targetSkill || ''}
                        onChange={(e) => setData({ targetSkill: e.target.value })}
                        className="h-14 text-lg border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-serif dark:bg-slate-950/50 dark:border-slate-800 dark:text-white"
                        autoFocus
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Proficiency</label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {levels.map((level) => (
                            <div
                                key={level.id}
                                onClick={() => setData({ currentLevel: level.id as any })}
                                className={`cursor-pointer rounded-xl border p-4 text-center transition-all duration-200 hover:scale-105 ${data.currentLevel === level.id
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10"
                                    : "border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-200 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="font-bold text-sm mb-1">{level.id}</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide opacity-80">{level.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Button
                onClick={handleNext}
                className="w-full h-12 text-base font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                disabled={!data.targetSkill || !data.currentLevel}
            >
                Continue to Learning Profile
            </Button>
        </motion.div>
    )
}
