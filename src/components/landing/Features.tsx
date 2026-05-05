'use client'

import { Brain, Layout, Layers, Zap, Clock } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "Adaptive architecture",
        description:
            "AI engines analyze your proficiency and learning style to construct a bespoke syllabus that evolves with you.",
        icon: Layout,
        className: "md:col-span-2 md:row-span-2",
    },
    {
        title: "Curated resources",
        description: "A library of high-impact articles, papers, and exercises.",
        icon: Layers,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Socratic guidance",
        description: "AI teaching assistant available 24/7 to clarify complex topics.",
        icon: Brain,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Micro-learning",
        description: "Bite-sized modules designed for maximum retention.",
        icon: Zap,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Smart scheduling",
        description: "Algorithms that fit study sessions into your weekly schedule.",
        icon: Clock,
        className: "md:col-span-2 md:row-span-1",
    },
]

export default function Features() {
    return (
        <section id="methodology" className="py-20 md:py-28 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-6">
                <SectionWrapper className="mb-14 text-center max-w-2xl mx-auto">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                        Methodology
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">
                        Engineered for retention
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        Cognitive science meets AI to build a learning experience that adapts to your brain.
                    </p>
                </SectionWrapper>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 max-w-5xl mx-auto md:h-[640px]">
                    {features.map((feature, i) => (
                        <BentoCard key={i} feature={feature} delay={i * 0.05} />
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
}

function BentoCard({ feature, delay }: { feature: Feature; delay: number }) {
    const Icon = feature.icon
    return (
        <SectionWrapper
            delay={delay}
            className={cn(
                "group relative p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 transition-colors duration-300 hover:border-slate-300 dark:hover:border-zinc-700",
                feature.className
            )}
        >
            <div className="relative h-full flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                        {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            </div>
        </SectionWrapper>
    )
}
