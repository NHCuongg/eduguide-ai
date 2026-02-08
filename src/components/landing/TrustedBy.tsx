'use client'

import { motion } from "framer-motion"

const universities = [
    "HARVARD", "STANFORD", "MIT", "BERKELEY", "CAMBRIDGE", "OXFORD", "YALE", "PRINCETON",
    "HARVARD", "STANFORD", "MIT", "BERKELEY", "CAMBRIDGE", "OXFORD", "YALE", "PRINCETON"
]

export default function TrustedBy() {
    return (
        <section className="bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900 py-16 overflow-hidden relative">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10" />

            <div className="container mx-auto px-6 mb-10 text-center">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">
                    Trusted by learners from elite institutions
                </p>
            </div>

            <div className="flex relative">
                <motion.div
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    className="flex gap-24 whitespace-nowrap min-w-max pl-24"
                >
                    {universities.map((uni, i) => (
                        <div key={i} className="text-3xl md:text-4xl font-serif font-black text-zinc-200 dark:text-zinc-800 select-none hover:text-indigo-200 dark:hover:text-indigo-900 transition-colors cursor-default">
                            {uni}
                        </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {universities.map((uni, i) => (
                        <div key={`dup-${i}`} className="text-3xl md:text-4xl font-serif font-black text-zinc-200 dark:text-zinc-800 select-none hover:text-indigo-200 dark:hover:text-indigo-900 transition-colors cursor-default">
                            {uni}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
