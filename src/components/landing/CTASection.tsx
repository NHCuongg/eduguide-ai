'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import SectionWrapper from "./SectionWrapper"
import { motion } from "framer-motion"

export default function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden bg-indigo-600 dark:bg-slate-900 transition-colors duration-500">
            {/* Animated Mesh Gradient Background - Adaptive */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-600 to-purple-600 dark:from-indigo-900 dark:via-slate-900 dark:to-slate-950 opacity-90" />

            {/* Noise overlay for texture */}
            <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

            {/* Floating Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 dark:bg-purple-600/30 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <SectionWrapper>
                    <h2 className="font-serif text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Study Smarter, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-400 dark:to-purple-400">Not Harder.</span>
                    </h2>
                    <p className="text-indigo-100 dark:text-indigo-200 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Join thousands of self-directed learners building their own accredited-style education with the power of EduGuide AI.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/onboarding">
                            <Button size="lg" className="h-16 px-10 text-lg bg-white text-indigo-600 dark:text-indigo-900 hover:bg-indigo-50 hover:scale-105 transition-all font-bold shadow-2xl rounded-full">
                                Try EduGuide Free
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" size="lg" className="h-16 px-10 text-lg border-white/30 text-white hover:bg-white/10 hover:text-white transition-all bg-transparent rounded-full backdrop-blur-sm">
                                Get a Demo
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-8 text-indigo-100/70 dark:text-indigo-300/60 text-sm">
                        No credit card required • Free tier forever
                    </p>
                </SectionWrapper>
            </div>
        </section>
    )
}
