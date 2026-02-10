'use client'

import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2, Ticket, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Step3() {
    const { data, prevStep, setRoadmap } = useWizardStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            // Emulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            // Mock response matching Roadmap interface
            const dummyRoadmap = {
                title: data.targetSkill || "Custom Roadmap",
                phases: [
                    {
                        name: "Phase 1: Getting Started",
                        modules: []
                    }
                ]
            }
            setRoadmap(dummyRoadmap)
            router.push('/dashboard')
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8 max-w-lg mx-auto"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Confirm Plan</h2>
                <p className="text-slate-500 dark:text-slate-400">verify your academic profile.</p>
            </div>

            {/* Receipt Ticket Card */}
            <div className="relative bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
                {/* Decorative Top */}
                <div className="h-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

                <div className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Subject</div>
                            <div className="text-xl font-serif font-black text-slate-900 dark:text-white">{data.targetSkill}</div>
                            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                                <CheckCircle2 className="w-3 h-3" /> {data.currentLevel}
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <Ticket className="w-6 h-6 text-slate-400" />
                        </div>
                    </div>

                    {/* Dashed Separator */}
                    <div className="relative h-px bg-slate-200 dark:bg-slate-800 my-6">
                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-black border border-slate-200 dark:border-slate-800" />
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-black border border-slate-200 dark:border-slate-800" />
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-sm">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Style</div>
                            <div className="font-bold text-slate-700 dark:text-slate-200">{data.learningStyle}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Commitment</div>
                            <div className="font-bold text-slate-700 dark:text-slate-200">{data.availability} hrs/week</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target</div>
                            <div className="font-bold text-slate-700 dark:text-slate-200">{data.deadline}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    className="w-1/3 h-12 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                    disabled={isLoading}
                >
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    className="w-2/3 h-12 text-base font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Ticket className="mr-2 h-5 w-5" />
                            Generate Syllabus
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    )
}
