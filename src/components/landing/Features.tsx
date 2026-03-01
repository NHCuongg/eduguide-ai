'use client'

import { Brain, Layout, Layers, Zap, Clock, Sparkles } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "Adaptive Architecture",
        description: "Our AI engines analyze your current proficiency and learning style to construct a bespoke syllabus that evolves as you progress.",
        icon: Layout,
        className: "md:col-span-2 md:row-span-2",
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        delay: 0
    },
    {
        title: "Curated Resources",
        description: "Access a library of high-impact articles, videos, and papers.",
        icon: Layers,
        className: "md:col-span-1 md:row-span-1",
        color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        delay: 0.1
    },
    {
        title: "Socratic Guidance",
        description: "AI Teaching Assistant available 24/7 to clarify complex topics.",
        icon: Brain,
        className: "md:col-span-1 md:row-span-1",
        color: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
        delay: 0.2
    },
    {
        title: "Micro-Learning",
        description: "Bite-sized modules designed for maximum retention.",
        icon: Zap,
        className: "md:col-span-1 md:row-span-1",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        delay: 0.3
    },
    {
        title: "Smart Scheduling",
        description: "Algorithms that optimize study times based on your circadian rhythm.",
        icon: Clock,
        className: "md:col-span-2 md:row-span-1",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        delay: 0.4
    },
]

export default function Features() {
    return (
        <section id="methodology" className="py-20 md:py-32 bg-white dark:bg-black relative z-20">
            <div className="container mx-auto px-6">
                <SectionWrapper className="mb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3 h-3" />
                        Methodology
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                        Engineered for Retention
                    </h2>
                    <p className="mt-6 text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        We combine cognitive science with advanced artificial intelligence to create a learning experience that adapts to your brain.
                    </p>
                </SectionWrapper>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 max-w-5xl mx-auto h-auto md:h-[800px]">
                    {features.map((feature, i) => (
                        <BentoCard key={i} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}

interface Feature {
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    className: string
    color: string
    delay: number
}

function BentoCard({ feature }: { feature: Feature }) {
    return (
        <SectionWrapper
            delay={feature.delay}
            className={cn(
                "group relative p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-zinc-200 dark:hover:border-zinc-700 hover:-translate-y-1",
                feature.className
            )}
        >
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", feature.color)}>
                        <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
                        {feature.title}
                    </h3>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {feature.description}
                </p>
            </div>

            {}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/50 dark:to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {}
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <feature.icon className="w-40 h-40" />
            </div>
        </SectionWrapper>
    )
}
