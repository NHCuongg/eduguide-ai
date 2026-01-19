'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import SectionWrapper from "./SectionWrapper"

const faqs = [
    {
        question: "What is EduGuide AI?",
        answer: "EduGuide AI is a personalized learning assistant that uses advanced artificial intelligence to create structured, academic-grade curriculums tailored to your specific goals and learning style."
    },
    {
        question: "How does EduGuide differ from other AI tools?",
        answer: "Unlike generic chatbots, EduGuide is purpose-built for education. We focus on rigorous pedagogical structures, reducing hallucinations, and providing verified academic resources rather than just text generation."
    },
    {
        question: "Is EduGuide suitable for beginners?",
        answer: "Absolutely. Our onboarding assessment calibrates the difficulty to your current level, ensuring that the path is challenging but achievable, whether you're a complete novice or an advanced learner."
    },
    {
        question: "Is EduGuide FERPA & COPPA compliant?",
        answer: "Yes. We adhere to the strictest data privacy standards in education. We do not sell student data and ensure all interactions are encrypted and secure."
    },
    {
        question: "What kind of support is available?",
        answer: "We offer 24/7 AI tutoring support within the workspace, as well as a dedicated community forum and comprehensive documentation for self-service help."
    }
]

export default function FAQSection() {
    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 dark:opacity-20 pointer-events-none">
                <div className="absolute top-20 left-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-900 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <SectionWrapper className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-sm font-bold tracking-wide mb-6 border border-indigo-100 dark:border-indigo-900">
                        <HelpCircle className="w-4 h-4" />
                        <span>Common Questions</span>
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Frequently Asked Questions.
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                        Everything you need to know about the product and billing.
                    </p>
                </SectionWrapper>

                <SectionWrapper delay={0.2}>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                className="group border-none rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md data-[state=open]:shadow-xl data-[state=open]:shadow-indigo-900/5 dark:data-[state=open]:shadow-indigo-900/20 data-[state=open]:ring-1 data-[state=open]:ring-indigo-100 dark:data-[state=open]:ring-indigo-900 transition-all duration-300"
                            >
                                <AccordionTrigger className="px-8 py-6 text-lg font-serif font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-700 dark:hover:text-indigo-400 hover:no-underline [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-indigo-600 [&[data-state=open]]:text-indigo-700">
                                    <span className="text-left leading-tight">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="px-8 pb-8 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed text-base">
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
