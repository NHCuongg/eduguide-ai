'use client'

import { useState } from "react"
import { PlayCircle } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import Image from "next/image"

export default function VideoSection() {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-10 pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-200 dark:bg-indigo-900 rounded-full blur-[80px]" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-200 dark:bg-pink-900 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionWrapper className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">See EduGuide in Action</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Discover how our AI curriculum designer transforms vague learning goals into rigorous, structured academic paths in seconds.
                    </p>
                </SectionWrapper>

                <SectionWrapper delay={0.2} className="max-w-5xl mx-auto relative group cursor-pointer">
                    <div
                        className="aspect-video bg-slate-900 rounded-2xl shadow-2xl overflow-hidden relative flex items-center justify-center border-4 border-white dark:border-slate-800"
                        onClick={() => setIsPlaying(true)}
                    >
                        {!isPlaying ? (
                            <>
                                {/* Real Video Thumbnail */}
                                <Image
                                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop"
                                    alt="EduGuide Interface Demo"
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg group-hover:bg-indigo-500 transition-colors">
                                            <PlayCircle className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8 text-white text-left z-10">
                                    <div className="font-bold text-xl mb-1">Product Walkthrough: from Zero to Syllabus</div>
                                    <div className="flex items-center gap-2 text-sm opacity-90">
                                        <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
                                        Live Demo • 2:14
                                    </div>
                                </div>
                            </>
                        ) : (
                            <video
                                src="/videos/intro.mp4"
                                controls
                                autoPlay
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Decorative background blur */}
                    <div className="absolute -inset-4 bg-indigo-600/20 rounded-[2.5rem] blur-2xl -z-10 group-hover:bg-indigo-600/30 transition-colors duration-500" />
                </SectionWrapper>
            </div>
        </section>
    )
}
