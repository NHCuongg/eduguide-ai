'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Quote, ArrowRight } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const TESTIMONIALS = [
    {
        id: 1,
        quote: (
            <>
                As an educator with 36 years of experience in various roles... I can confidently say that <span className="text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 px-1 rounded">EduGuide AI has impressed me more than any other teacher tool I&apos;ve encountered...</span> AI is transforming the world, and <span className="text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 px-1 rounded">EduGuide AI is at the forefront of revolutionizing education</span> by empowering teachers to focus on what matters most—teaching.
            </>
        ),
        name: "Robin Finley, Ed.D",
        role: "Educational Consultant",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        quote: (
            <>
                The personalized roadmaps transformed how I study for my medical boards. The AI doesn&apos;t just give answers, <span className="text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 px-1 rounded">it acts like a tireless tutor that genuinely wants me to understand</span> the core concepts before moving on.
            </>
        ),
        name: "Dr. Alex Mercer",
        role: "Medical Resident",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 3,
        quote: (
            <>
                I was skeptical about AI in education at first. But EduGuide AI has proven that <span className="text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 px-1 rounded">beautifully orchestrated algorithms can indeed create a perfectly paved road of knowledge.</span> An absolute game changer for self-taught developers.
            </>
        ),
        name: "Sarah Jenkins",
        role: "Self-taught Software Engineer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    }
]

export default function TestimonialSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const nextTestimonial = () => {
        setIsAutoPlaying(false)
        setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }

    const activeTestimonial = TESTIMONIALS[activeIndex]

    return (
        <section className="relative bg-purple-50 dark:bg-purple-950/20 pt-32 pb-32 mt-[-5px] transition-colors duration-500 overflow-hidden">
            {}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[60px] md:h-[100px] w-[calc(100%+1.3px)] fill-white dark:fill-slate-900 transition-colors duration-500">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
                </svg>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <SectionWrapper>
                    <div className="flex justify-center mb-8">
                        <Quote className="h-12 w-12 text-purple-300 dark:text-purple-700 fill-purple-300 dark:fill-purple-700" />
                    </div>

                    <div className="relative min-h-[300px] md:min-h-[200px] w-full max-w-4xl mx-auto flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTestimonial.id}
                                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-12">
                                    {activeTestimonial.quote}
                                </blockquote>

                                <div className="flex flex-col items-center gap-4 mb-10">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-slate-200 dark:bg-slate-800">
                                        <Image
                                            src={activeTestimonial.image}
                                            alt={activeTestimonial.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <cite className="not-italic font-bold text-slate-900 dark:text-white block">{activeTestimonial.name}</cite>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">{activeTestimonial.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {}
                        <div className="flex justify-center gap-2 mt-4">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIsAutoPlaying(false)
                                        setActiveIndex(i)
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-purple-600 dark:bg-purple-500" : "w-2 bg-purple-300 dark:bg-purple-800/50 hover:bg-purple-400 dark:hover:bg-purple-700"}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Button
                            onClick={nextTestimonial}
                            variant="outline"
                            className="h-12 px-8 bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-800 dark:hover:text-purple-200 rounded-full shadow-sm transition-all group"
                        >
                            Read Next Story
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </SectionWrapper>
            </div>
        </section>
    )
}
