// ... imports
import { useState, useEffect } from "react"
import { MousePointerClick, FileText, Wand2, Globe, Sparkles, Search, Download } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const steps = [
    {
        number: "1",
        title: "Select your resource",
        description: "Choose from a variety of teaching tools, including lesson plans, graphic organizers, educational games, and more.",
        icon: MousePointerClick,
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-64">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Lesson Plan</span>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 flex flex-col items-center gap-2">
                        <Sparkles className="w-8 h-8 text-purple-500" />
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Game</span>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 flex flex-col items-center gap-2 col-span-2">
                        <Globe className="w-8 h-8 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Graphic Organizer</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        number: "2",
        title: "Enter a topic",
        description: "Start with a few keywords to shape your resource. Upload documents or select a website for personalized content.",
        icon: FileText,
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-900 dark:text-slate-200">Photosynthesis process|</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="flex gap-2 mt-4">
                        <div className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">Biology</div>
                        <div className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">Grade 5</div>
                    </div>
                </div>
            </div>
        )
    },
    {
        number: "3",
        title: "Click Generate",
        description: "Wait for the resource to be created. Refine, edit and export it to Word, Google Docs, or PDF.",
        icon: Wand2,
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Download className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white mb-1">Ready to Download</div>
                        <div className="text-xs text-slate-500">Generated in 2.5s</div>
                    </div>
                    <div className="w-full h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none">
                        Download PDF
                    </div>
                </div>
            </div>
        )
    }
]

export default function HowItWorksSection() {
    const [activeStep, setActiveStep] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    return (
        <section id="methodology" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-500">
            <div className="container mx-auto px-6">
                <SectionWrapper className="mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-bold tracking-wide mb-6">
                        How it works
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                        Classroom-Ready <br />
                        Resources in 3 Steps.
                    </h2>
                </SectionWrapper>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side: Stepper */}
                    <div className="space-y-8 relative">
                        {/* Connecting Line - Dynamic Height based on steps being a fixed list implies we can just have a full line behind */}
                        <div className="absolute left-[27px] top-4 bottom-12 w-0.5 bg-slate-100 dark:bg-slate-800 -z-10" />

                        {/* Progress Line (Animated) - Optional complexity, skipping for simplicity to avoid height calc issues */}

                        {steps.map((step, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveStep(i)}
                                className={cn(
                                    "flex gap-8 group cursor-pointer rounded-2xl p-4 transition-all duration-300",
                                    activeStep === i ? "bg-slate-50 dark:bg-slate-800/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                                )}
                            >
                                <div className={cn(
                                    "shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xl transition-all duration-300 relative z-10 shadow-sm",
                                    activeStep === i
                                        ? "bg-indigo-600 border-indigo-600 text-white scale-110"
                                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500"
                                )}>
                                    {step.number}
                                </div>
                                <div>
                                    <h3 className={cn(
                                        "text-xl font-bold mb-2 transition-colors",
                                        activeStep === i ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"
                                    )}>
                                        {step.title}
                                    </h3>
                                    <p className={cn(
                                        "leading-relaxed max-w-md transition-colors",
                                        activeStep === i ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-500"
                                    )}>
                                        {step.description}
                                    </p>

                                    {activeStep === i && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="h-1 bg-indigo-600 rounded-full mt-4 w-12"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Visuals */}
                    <div className="relative aspect-square w-full max-w-lg mx-auto bg-slate-50 dark:bg-slate-800 rounded-3xl border-4 border-slate-100 dark:border-slate-700 p-8 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0"
                            >
                                {steps[activeStep].visual}
                            </motion.div>
                        </AnimatePresence>

                        {/* Decorative Blob */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </section>
    )
}

