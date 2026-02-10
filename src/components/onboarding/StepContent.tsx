'use client'

import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Book, FileText, MonitorPlay, MousePointerClick, Layers } from "lucide-react"

export default function StepContent() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const handleSelect = (pref: any) => {
        setData({ contentPreference: pref })
    }

    const options = [
        { id: "Video", icon: MonitorPlay, label: "Video Based", desc: "Watch and learn" },
        { id: "Text", icon: FileText, label: "Text Based", desc: "Read at your own pace" },
        { id: "Interactive", icon: MousePointerClick, label: "Interactive", desc: "Quizzes and hands-on" },
        { id: "Mixed", icon: Layers, label: "Mixed Media", desc: "A bit of everything" },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Learning Format</h2>
                <p className="text-slate-500 dark:text-slate-400">How do you prefer to consume content?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {options.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = data.contentPreference === opt.id
                    return (
                        <div
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className={`
                                cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all duration-200
                                ${isSelected
                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md ring-1 ring-indigo-600"
                                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                                }
                            `}
                        >
                            <div className={`
                                p-3 rounded-full mr-4
                                ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}
                            `}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">{opt.label}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{opt.desc}</p>
                            </div>
                            <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 dark:border-slate-600"}
                            `}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
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
                    disabled={!data.contentPreference}
                    className="w-32 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Next
                </Button>
            </div>
        </motion.div>
    )
}
