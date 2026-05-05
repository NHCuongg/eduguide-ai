'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const subjects = ["Biology", "Computer Science", "History", "Psychology", "Physics", "Literature"]

export default function Hero() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % subjects.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="relative overflow-hidden bg-white dark:bg-zinc-950 pt-32 pb-32 lg:pt-44 lg:pb-40 transition-colors duration-500">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_50%_40%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                    >
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-500">
                            EduGuide AI
                        </p>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-slate-900 dark:text-white leading-[1.05] tracking-tight"
                    >
                        A study plan for{" "}
                        <span aria-live="polite" aria-atomic="true">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={subjects[index]}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                    className="italic text-indigo-600 dark:text-indigo-400 inline-block"
                                >
                                    {subjects[index]}
                                </motion.span>
                            </AnimatePresence>
                        </span>{" "}
                        you'll actually finish.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl mx-auto"
                    >
                        Tell us the topic and how many hours you can spare each week.
                        We'll lay out the modules, quizzes and flashcards. You take it from there.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
                    >
                        <Button asChild size="lg">
                            <Link href="/onboarding">
                                Start a plan <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="lg">
                            <Link href="#methodology">How it works</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
