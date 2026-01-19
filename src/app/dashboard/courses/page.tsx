'use client'

import { Button } from "@/components/ui/button"
import { MoreHorizontal, Play, Star, Clock, Trophy } from "lucide-react"

export default function MyCoursesPage() {
    return (
        <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto">
            <h1 className="font-serif text-3xl font-bold text-slate-900 mb-8">My Courses</h1>

            {/* Resume Section */}
            <div className="mb-12">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Continue Learning</h2>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="h-32 w-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shrink-0 flex items-center justify-center text-white relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <Play className="fill-white h-10 w-10 opacity-90" />
                    </div>
                    <div className="flex-1 py-1">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                                <span className="text-xs text-slate-400 font-medium">Last active: 2 hours ago</span>
                            </div>
                            <MoreHorizontal className="text-slate-300 hover:text-slate-500 h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">Advanced AI Engineering</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">Mastering Transformers, Large Language Models, and deploying scalable AI architectures.</p>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>Progress</span>
                                <span>32%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[32%] bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Explore Section */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Explore More</h2>
                <Button variant="link" className="text-indigo-600 font-bold text-sm">Browse Catalog</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                        {/* Mock Image using Gradient/Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mixed-blend-overlay" />

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm text-slate-800">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/20">Frontend Mastery</span>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">React 19 & Next.js</h4>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">Deep dive into Server Components, Actions, and advanced patterns.</p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 mt-auto">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Clock className="h-3.5 w-3.5" /> 12h</span>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Trophy className="h-3.5 w-3.5" /> Intermediate</span>
                        </div>

                        <Button className="w-full bg-slate-900 text-white hover:bg-indigo-600 shadow-md hover:shadow-lg transition-all font-bold">
                            Start Course
                        </Button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mixed-blend-overlay" />

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm text-slate-800">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.7
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/20">Data Science</span>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-teal-600 transition-colors">Data Science Fundamentals</h4>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">From Python basics to deploying your first Machine Learning model.</p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 mt-auto">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Clock className="h-3.5 w-3.5" /> 24h</span>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Trophy className="h-3.5 w-3.5" /> Beginner</span>
                        </div>

                        <Button className="w-full bg-slate-900 text-white hover:bg-teal-600 shadow-md hover:shadow-lg transition-all font-bold">
                            Start Course
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
