'use client'

import { Button } from "@/components/ui/button"
import { Quote, ArrowRight } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import Image from "next/image"
import Link from "next/link"

export default function TestimonialSection() {
    return (
        <section className="relative bg-purple-50 dark:bg-purple-950/20 pt-32 pb-32 mt-[-5px] transition-colors duration-500">
            {/* Curved Top Divider */}
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

                    <blockquote className="max-w-4xl mx-auto font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-12">
                        As an educator with 36 years of experience in various roles... I can confidently say that <span className="text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 px-1 rounded">Eduaide has impressed me more than any other teacher tool I've encountered...</span> AI is transforming the world, and <span className="text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 px-1 rounded">Eduaide is at the forefront of revolutionizing education</span> by empowering teachers to focus on what matters most—teaching.
                    </blockquote>

                    <div className="flex flex-col items-center gap-4 mb-10">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                                alt="Robin Finley"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center">
                            <cite className="not-italic font-bold text-slate-900 dark:text-white block">Robin Finley, Ed.D</cite>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Educational Consultant</span>
                        </div>
                    </div>

                    <Link href="#">
                        <Button variant="outline" className="h-12 px-8 bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-800 dark:hover:text-purple-200 rounded-full shadow-sm transition-all group">
                            View More Stories
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </SectionWrapper>
            </div>
        </section>
    )
}
