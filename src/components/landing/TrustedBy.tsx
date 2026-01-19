'use client'

import { motion } from "framer-motion"

const universities = [
    "HARVARD", "STANFORD", "MIT", "BERKELEY", "CAMBRIDGE", "OXFORD", "YALE", "PRINCETON",
    "HARVARD", "STANFORD", "MIT", "BERKELEY", "CAMBRIDGE", "OXFORD", "YALE", "PRINCETON"
]

export default function TrustedBy() {
    return (
        <section className="bg-slate-50 border-y border-slate-100 py-12 overflow-hidden relative">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />

            <div className="container mx-auto px-6 mb-8 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Trusted by learners from</p>
            </div>

            <div className="flex">
                <motion.div
                    animate={{ x: "-50%" }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-24 whitespace-nowrap"
                >
                    {universities.map((uni, i) => (
                        <div key={i} className="text-2xl md:text-3xl font-serif font-black text-slate-200 select-none">
                            {uni}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
