'use client'

import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Laptop, Sparkles, Trophy } from "lucide-react"

export default function StepGoals() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const handleSelect = (goal: any) => {
        setData({ primaryGoal: goal })

    }

    const goals = [
        { id: "Career Change", icon: Briefcase, label: "Career Change", desc: "Switching to a new field" },
        { id: "Skill Improvement", icon: Trophy, label: "Skill Up", desc: "Sharpening current skills" },
        { id: "Academic", icon: GraduationCap, label: "Academic", desc: "School or university" },
        { id: "Hobby", icon: Sparkles, label: "Hobby", desc: "Just for fun" },
        { id: "Other", icon: Laptop, label: "Other", desc: "Something else" },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">What&apos;s your main goal?</h2>
                <p className="text-slate-500 dark:text-slate-400">Understanding your motivation helps us tailor the pace.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                    const Icon = goal.icon
                    const isSelected = data.primaryGoal === goal.id
                    return (
                        <div
                            key={goal.id}
                            onClick={() => handleSelect(goal.id)}
                            className={`
                                cursor-pointer group relative p-4 rounded-xl border-2 transition-all duration-300
                                ${isSelected
                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400 shadow-lg scale-[1.02]"
                                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                    p-3 rounded-lg transition-colors
                                    ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-600"}
                                `}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`font-bold ${isSelected ? "text-indigo-900 dark:text-indigo-100" : "text-slate-900 dark:text-white"}`}>
                                        {goal.label}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {goal.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={prevStep} className="w-32">
                    Back
                </Button>
                <Button
                    onClick={nextStep}
                    disabled={!data.primaryGoal}
                    className="w-32 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Next
                </Button>
            </div>
        </motion.div>
    )
}
