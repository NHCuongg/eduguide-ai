'use client'

import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Code, Music, Palette, Globe, Cpu, BookOpen, Calculator, Beaker } from "lucide-react"

export default function StepInterests() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const interests = data.interests || []

    const toggleInterest = (id: string) => {
        if (interests.includes(id)) {
            setData({ interests: interests.filter(i => i !== id) })
        } else {
            setData({ interests: [...interests, id] })
        }
    }

    const options = [
        { id: "Tech", icon: Code, label: "Technology" },
        { id: "Art", icon: Palette, label: "Art & Design" },
        { id: "Science", icon: Beaker, label: "Science" },
        { id: "Math", icon: Calculator, label: "Mathematics" },
        { id: "History", icon: BookOpen, label: "History" },
        { id: "Music", icon: Music, label: "Music" },
        { id: "Languages", icon: Globe, label: "Languages" },
        { id: "Engineering", icon: Cpu, label: "Engineering" },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Related Interests</h2>
                <p className="text-slate-500 dark:text-slate-400">Select topics you enjoy to help us find relevant examples.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = interests.includes(opt.id)
                    return (
                        <div
                            key={opt.id}
                            onClick={() => toggleInterest(opt.id)}
                            className={`
                                cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 aspect-square
                                ${isSelected
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 scale-105 shadow-md"
                                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-800"
                                }
                            `}
                        >
                            <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                            <span className="font-semibold text-sm">{opt.label}</span>
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
                    disabled={interests.length === 0}
                    className="w-32 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Next
                </Button>
            </div>
        </motion.div>
    )
}
