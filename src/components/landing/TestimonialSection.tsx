import SectionWrapper from "./SectionWrapper"

const TESTIMONIALS = [
    {
        quote:
            "EduGuide AI has impressed me more than any other teacher tool I've encountered. AI is transforming the world, and EduGuide AI is at the forefront — empowering teachers to focus on what matters most.",
        name: "Robin Finley, Ed.D",
        role: "Educational Consultant",
    },
    {
        quote:
            "The personalized roadmaps transformed how I study for my medical boards. The AI doesn't just give answers — it acts like a tireless tutor that genuinely wants me to understand the core concepts before moving on.",
        name: "Dr. Alex Mercer",
        role: "Medical Resident",
    },
    {
        quote:
            "I was skeptical about AI in education at first. EduGuide proved that beautifully orchestrated algorithms can create a perfectly paved road of knowledge. An absolute game changer for self-taught developers.",
        name: "Sarah Jenkins",
        role: "Self-taught Software Engineer",
    },
]

export default function TestimonialSection() {
    return (
        <section className="py-20 md:py-28 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionWrapper className="mb-12 text-center max-w-2xl mx-auto">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                        Testimonials
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Loved by self-directed learners
                    </h2>
                </SectionWrapper>

                <div className="grid md:grid-cols-3 gap-5">
                    {TESTIMONIALS.map((t, i) => (
                        <SectionWrapper
                            key={i}
                            delay={i * 0.07}
                            className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-6 md:p-7 flex flex-col h-full"
                        >
                            <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-200 mb-5 flex-1">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                            </div>
                        </SectionWrapper>
                    ))}
                </div>
            </div>
        </section>
    )
}
