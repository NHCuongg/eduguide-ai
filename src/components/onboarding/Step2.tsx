'use client'

import { useWizardStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Video, BookOpen, Hammer, Clock, Calendar } from "lucide-react"

export default function Step2() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const handleNext = () => {
        if (data.learningStyle && data.availability && data.deadline) {
            nextStep()
        }
    }

    const styles = [
        { id: "Visual", label: "Visual", desc: "Videos & Diagrams", icon: Video },
        { id: "Reading", label: "Reading", desc: "Docs & Articles", icon: BookOpen },
        { id: "Hands-on", label: "Pragmatic", desc: "Projects & Labs", icon: Hammer },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8 max-w-lg mx-auto"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Learning Profile</h2>
                <p className="text-slate-500 dark:text-slate-400">How do you learn best?</p>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Preferred Style</label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {styles.map((style) => (
                            <div
                                key={style.id}
                                onClick={() => setData({ learningStyle: style.id as "Visual" | "Reading" | "Hands-on" })}
                                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 hover:scale-105 ${data.learningStyle === style.id
                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transform scale-105"
                                    : "border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                                    }`}
                            >
                                <style.icon className={`w-6 h-6 mb-1 ${data.learningStyle === style.id ? "text-indigo-100" : "text-slate-500"}`} />
                                <div className="font-bold text-sm">{style.label}</div>
                                <div className={`text-[10px] uppercase tracking-wide font-semibold ${data.learningStyle === style.id ? "text-indigo-100" : "text-slate-500"}`}>{style.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Weekly Hours
                        </label>
                        <Input
                            type="number"
                            placeholder="e.g. 10"
                            value={data.availability || ''}
                            min={1}
                            max={168}
                            onChange={(e) => setData({ availability: parseInt(e.target.value) || 0 })}
                            className="h-12 bg-white focus:bg-white dark:focus:bg-slate-900 border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 dark:bg-slate-900 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Target Date
                        </label>
                        <Input
                            type="date"
                            value={data.deadline || ''}
                            onChange={(e) => setData({ deadline: e.target.value })}
                            className="h-12 bg-white focus:bg-white dark:focus:bg-slate-900 border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 dark:bg-slate-900 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                        />
                    </div>
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
                    className="w-2/3 h-12 text-base font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                    disabled={!data.learningStyle || !data.availability || !data.deadline}
                >
                    Review Profile
                </Button>
            </div>
        </motion.div>
    )
}
