'use client'

import { useRef, useState } from "react"
import { Brain, Layout, Layers, Zap, Clock, Shield } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import { motion } from "framer-motion"

const features = [
    {
        title: "Adaptive Architecture",
        description: "Our AI engines analyze your current proficiency and learning style to construct a bespoke syllabus that evolves as you progress.",
        icon: Layout,
        className: "md:col-span-2",
        color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400"
    },
    {
        title: "Curated Resources",
        description: "Access a library of high-impact articles, videos, and papers.",
        icon: Layers,
        className: "md:col-span-1",
        color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400"
    },
    {
        title: "Socratic Guidance",
        description: "An integrated AI teaching assistant is always available to clarify complex topics, conduct quizzes, and ensure retention.",
        icon: Brain,
        className: "md:col-span-1",
        color: "text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/30 dark:text-fuchsia-400"
    },
    {
        title: "Micro-Learning",
        description: "Bite-sized modules designed for maximum retention in minimum time.",
        icon: Zap,
        className: "md:col-span-1",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400"
    },
    {
        title: "Smart Scheduling",
        description: "Algorithms that optimize study times based on your circadian rhythm and availability.",
        icon: Clock,
        className: "md:col-span-1",
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400"
    },
]

export default function Features() {
    return (
        <section id="methodology" className="py-20 md:py-32 bg-zinc-50 dark:bg-zinc-950 relative z-20 rounded-t-[3rem] -mt-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] transition-colors duration-500">
            <div className="container mx-auto px-6">
                <SectionWrapper className="mb-20 text-center">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">Core Methodology</h2>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-fuchsia-500 mx-auto rounded-full"></div>
                    <p className="mt-6 text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        We combine cognitive science with advanced artificial intelligence to create a learning experience that adapts to your brain.
                    </p>
                </SectionWrapper>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <SpotlightCard key={i} index={i} feature={feature} className={feature.className} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function SpotlightCard({ feature, index, className }: { feature: any, index: number, className?: string }) {
    const divRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return
        const rect = divRef.current.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const handleMouseEnter = () => setOpacity(1)
    const handleMouseLeave = () => setOpacity(0)

    return (
        <SectionWrapper delay={index * 0.1} className={className}>
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group h-full p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
            >
                {/* Spotlight Effect */}
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`
                    }}
                />

                <div className="relative z-10">
                    <div className={`mb-6 inline-flex p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-300 ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
                        <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                        {feature.title}
                    </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg relative z-10 font-light">
                    {feature.description}
                </p>
            </div>
        </SectionWrapper>
    )
}
