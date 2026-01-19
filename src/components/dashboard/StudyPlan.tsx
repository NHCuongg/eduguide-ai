'use client'

import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, LayoutGrid, List, Trophy, Clock, MoreHorizontal, Sparkles, Zap, Circle } from "lucide-react"
import { useState } from "react"

export default function StudyPlan() {
    const { roadmap } = useWizardStore()

    // Flatten phases to get a list of "Sessions" for demo purposes
    // In a real app, this would be grouped by days
    const allSessions = roadmap?.phases.flatMap((phase: any, phaseIdx: number) =>
        phase.modules.map((module: any, modIdx: number) => ({
            ...module,
            id: `${phaseIdx}-${modIdx}`,
            phaseName: phase.name,
            phaseIdx,
            modIdx
        }))
    ) || []

    const [activeTab, setActiveTab] = useState<'today' | 'roadmap'>('today')

    return (
        <div className="flex-1 bg-slate-50/50 relative">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-6 sticky top-0 z-20 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
                            Current Course
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Advanced AI Engineering</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2 hidden md:flex hover:bg-slate-50 transition-all">
                            <List className="h-4 w-4" /> Curriculum
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">
                            <Zap className="h-4 w-4 fill-white" /> Smart Resume
                        </Button>
                    </div>
                </div>

                {/* AI Briefing Card */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group hover:shadow-indigo-500/30 transition-all duration-500 cursor-default">
                    <div className="relative z-10 flex items-start gap-5">
                        <div className="p-3.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="h-6 w-6 text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-2 tracking-tight">Good Morning, Dr. Dalton! ☀️</h3>
                            <p className="text-indigo-50 text-sm max-w-2xl leading-relaxed font-medium/90">
                                You're on a <span className="font-bold text-white border-b border-white/30">3-day streak</span>! Based on your recent quiz performance in <b>Neural Networks</b>, we've adjusted today's plan to focus more on <b>Transformers</b>.
                            </p>
                        </div>
                    </div>
                    {/* Living Background Decor */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
                </div>

                {/* Interactive Tabs */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50">
                        <button
                            onClick={() => setActiveTab('today')}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ease-out",
                                activeTab === 'today'
                                    ? "bg-white text-indigo-900 shadow-sm ring-1 ring-black/5"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                        >
                            Today's Plan
                        </button>
                        <button
                            onClick={() => setActiveTab('roadmap')}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ease-out",
                                activeTab === 'roadmap'
                                    ? "bg-white text-indigo-900 shadow-sm ring-1 ring-black/5"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                        >
                            Full Roadmap
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                            <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-indigo-50 text-indigo-600 shadow-sm">
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="p-8 pb-32 overflow-y-auto h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allSessions.map((session: any, i: number) => {
                        const isCurrent = i === 0
                        return (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-3xl border p-8 transition-all duration-500 relative group cursor-pointer flex flex-col justify-between",
                                    isCurrent
                                        ? "bg-white border-indigo-500 ring-4 ring-indigo-500/10 shadow-2xl shadow-indigo-500/20 scale-[1.02] z-10"
                                        : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-2"
                                )}
                            >
                                {/* Active Indicator Dot */}
                                {isCurrent && (
                                    <span className="absolute top-6 right-6 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-white"></span>
                                    </span>
                                )}

                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-base shadow-inner transition-colors duration-300",
                                            isCurrent ? "bg-indigo-600 text-white shadow-indigo-700/50" : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                                        )}>
                                            {i + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Session {i + 1}</span>
                                            <span className={cn("text-xs font-bold", isCurrent ? "text-indigo-600" : "text-slate-500 group-hover:text-indigo-600 transition-colors")}>{session.phaseName}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-serif font-bold text-slate-900 text-xl mb-4 line-clamp-3 leading-snug group-hover:text-indigo-700 transition-colors">
                                        {session.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100/50 group-hover:border-indigo-200 transition-colors">
                                            Concept
                                        </span>
                                        <span className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-100/50 group-hover:border-purple-200 transition-colors">
                                            Practice
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between group-hover:border-slate-100 transition-colors">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold group-hover:text-slate-700">
                                        <Clock className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        45m
                                    </div>
                                    {isCurrent ? (
                                        <Button size="sm" className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full px-6 shadow-xl shadow-indigo-300 hover:shadow-indigo-400 hover:scale-105 transition-all duration-300">
                                            Start Now
                                        </Button>
                                    ) : (
                                        <div className="h-10 flex items-center justify-center w-10 rounded-full hover:bg-slate-100 transition-colors">
                                            <MoreHorizontal className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
