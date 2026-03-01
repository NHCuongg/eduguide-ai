'use client'

import { Lock, FileText, Shield, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import SectionWrapper from "./SectionWrapper"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PrivacySection() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
            {}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 dark:bg-slate-900/50 blur-3xl opacity-50" />
            </div>

            {}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-[10%] opacity-[0.03] dark:opacity-[0.05]"
                >
                    <ShieldCheck className="w-64 h-64 dark:text-white" />
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionWrapper>
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden transition-colors duration-500">

                        {}
                        <div className="absolute -top-10 -right-10 text-slate-50 dark:text-slate-800 opacity-50 pointer-events-none">
                            <Shield className="w-64 h-64 fill-slate-50 dark:fill-slate-800" />
                        </div>

                        <div className="space-y-8 max-w-3xl relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wide">
                                <Lock className="h-3 w-3" />
                                Privacy Center
                            </div>

                            <div className="space-y-4">
                                <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                                    We Take Your Data Seriously.
                                </h2>

                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
                                    We never share or sell your data to third parties. EduGuide&apos;s philosophy is to minimize data collection with a focus on providing a secure, private learning footprint.
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 relative z-10">
                            <Link href="#">
                                <Button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2 text-base">
                                    <FileText className="h-5 w-5" />
                                    Read Privacy Policy
                                </Button>
                            </Link>
                        </div>
                    </div>
                </SectionWrapper>
            </div>
        </section>
    )
}
