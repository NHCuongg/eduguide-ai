'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, BookOpen, GraduationCap, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import HeroParticles from "./HeroParticles"

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
        <section className="relative overflow-hidden bg-white dark:bg-zinc-950 pt-32 pb-40 lg:pt-48 lg:pb-48 transition-colors duration-500">
            {/* Animated Modern Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Dynamic Particles */}
            <HeroParticles />

            {/* Glowing Orbs - Softer & Slower */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 40, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-violet-500/20 dark:bg-violet-500/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-sm hover:border-indigo-500/50 transition-colors">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                AI-Powered Curriculum Architecture
                            </span>
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tight pb-2 flex flex-col items-center"
                    >
                        <span>Design Your</span>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={subjects[index]}
                                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ duration: 0.4 }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 py-2 inline-block"
                            >
                                {subjects[index]}
                            </motion.span>
                        </AnimatePresence>
                        <span>Curriculum</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto font-light"
                    >
                        Harness the power of AI to construct rigorous, personalized learning paths.
                        Master any subject with a structure adapted to your unique profile.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    >
                        <Link href="/onboarding">
                            <Button size="xl" className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-transform duration-300 shadow-xl shadow-indigo-500/10">
                                Begin Assessment
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#methodology">
                            <Button variant="outline" size="xl" className="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                View Methodology
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Floating Icons/Elements for depth */}
                    <div className="hidden lg:block absolute top-1/2 -left-12 -translate-y-1/2 w-24 h-24 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl rotate-12 flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
                        <Brain className="w-10 h-10 text-indigo-500" />
                    </div>
                    <div className="hidden lg:block absolute top-1/3 -right-4 w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl -rotate-6 flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
                        <BookOpen className="w-8 h-8 text-violet-500" />
                    </div>
                    <div className="hidden lg:block absolute bottom-1/4 left-10 w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl rotate-6 flex items-center justify-center animate-float" style={{ animationDelay: '3s' }}>
                        <GraduationCap className="w-6 h-6 text-fuchsia-500" />
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-300 to-transparent dark:from-zinc-700" />
            </motion.div>
        </section>
    )
}
