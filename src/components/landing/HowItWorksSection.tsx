import { MousePointerClick, FileText, Wand2 } from "lucide-react"
import SectionWrapper from "./SectionWrapper"

const steps = [
    {
        number: "01",
        title: "Tell us what to learn",
        description: "Pick your subject, level, weekly hours, and deadline. Mention any background or interests.",
        icon: MousePointerClick,
    },
    {
        number: "02",
        title: "We draft a roadmap",
        description: "A 3-phase plan tuned to your goal, hours, and weak spots. Takes about 30 seconds.",
        icon: FileText,
    },
    {
        number: "03",
        title: "Study, track, repeat",
        description: "Each module unlocks readings, quizzes, flashcards, and exercises. Mark progress as you go.",
        icon: Wand2,
    },
]

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-20 md:py-28 bg-slate-50 dark:bg-zinc-950">
            <div className="container mx-auto px-6">
                <SectionWrapper className="mb-14 text-center max-w-2xl mx-auto">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                        How it works
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        From subject to mastery in 3 steps
                    </h2>
                </SectionWrapper>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {steps.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <SectionWrapper
                                key={i}
                                delay={i * 0.07}
                                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-7"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest">
                                        {step.number}
                                    </span>
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </SectionWrapper>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
