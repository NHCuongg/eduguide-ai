'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import SectionWrapper from "./SectionWrapper"

const faqs = [
    {
        question: "What is EduGuide AI?",
        answer:
            "EduGuide AI is a personalized learning assistant that uses AI to create structured, academic-grade curriculums tailored to your goals and learning style.",
    },
    {
        question: "How does EduGuide differ from other AI tools?",
        answer:
            "Unlike generic chatbots, EduGuide is purpose-built for education: rigorous pedagogical structures, reduced hallucinations, and verified academic resources.",
    },
    {
        question: "Is EduGuide suitable for beginners?",
        answer:
            "Yes. The onboarding assessment calibrates difficulty to your current level so the path is challenging but achievable.",
    },
    {
        question: "Is EduGuide FERPA & COPPA compliant?",
        answer:
            "Yes. We adhere to the strictest data privacy standards in education. We do not sell student data and all interactions are encrypted.",
    },
    {
        question: "What kind of support is available?",
        answer:
            "24/7 AI tutoring inside the workspace, plus a community forum and self-service docs.",
    },
]

export default function FAQSection() {
    return (
        <section id="faq" className="py-20 md:py-28 bg-slate-50 dark:bg-zinc-950">
            <div className="container mx-auto px-6 max-w-3xl">
                <SectionWrapper className="text-center mb-12">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                        FAQ
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Frequently asked questions
                    </h2>
                </SectionWrapper>

                <SectionWrapper delay={0.1}>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {faqs.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                className="border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 px-5"
                            >
                                <AccordionTrigger className="py-4 text-left font-semibold text-slate-900 dark:text-white hover:no-underline">
                                    <span>{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 pt-0 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </SectionWrapper>
            </div>
        </section>
    )
}
