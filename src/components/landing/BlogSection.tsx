'use client'

import { ArrowRight } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import Image from "next/image"

const posts = [
    {
        title: "The Future of AI in Higher Education",
        date: "August 11, 2026",
        category: "EdTech",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Structuring a Self-Taught Computer Science Degree",
        date: "July 24, 2026",
        category: "Learning Strategies",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Updates: New Accreditation Features",
        date: "June 15, 2026",
        category: "Product News",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
    }
]

export default function BlogSection() {
    return (
        <section id="resources" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <SectionWrapper>
                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wide mb-4">
                            EduGuide Blog
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Recent Posts.</h2>
                    </SectionWrapper>
                    <a href="#" className="hidden md:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <SectionWrapper key={i} delay={i * 0.1}>
                            <div className="group cursor-pointer">
                                <div className="aspect-[4/3] w-full rounded-2xl mb-4 relative overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" /> {}
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-300" />
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded-md">{post.category}</span>
                                    <span className="text-sm text-slate-400 dark:text-slate-500">{post.date}</span>
                                </div>

                                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {post.title}
                                </h3>
                            </div>
                        </SectionWrapper>
                    ))}
                </div>
            </div>
        </section>
    )
}
