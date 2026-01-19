'use client';

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWizardStore } from "@/lib/store"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, TrendingUp, Calendar, Zap, BookOpen, Search, Filter, MoreHorizontal, Clock, CheckCircle2, Trophy } from "lucide-react"
import { StaggerContainer, StaggerItem, HoverCard, FadeIn } from "@/components/ui/motion-primitives"
import dynamic from "next/dynamic"

const QuizModal = dynamic(() => import("./quiz/QuizModal").then(mod => mod.QuizModal), { ssr: false })
const CalendarView = dynamic(() => import("./schedule/CalendarView").then(mod => mod.CalendarView), { ssr: false })
const ResourceModal = dynamic(() => import("./resources/ResourceModal").then(mod => mod.ResourceModal), { ssr: false })

export default function MainContent() {
    const router = useRouter()
    const { data } = useWizardStore()

    // Redirect to onboarding if no data found (fresh session)
    useEffect(() => {
        // Simple check: if no targetSkill, assume not onboarded
        if (!data?.targetSkill) {
            router.push("/onboarding")
        }
    }, [data, router])

    if (!data?.targetSkill) return null // Avoid flash of content

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 xl:p-10 scroll-smooth">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* 1. Header Section */}
                <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif mb-2">
                            Welcome back, <span className="text-primary">Learner</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            Ready to continue your mastery in <span className="text-slate-700 font-semibold">{data.targetSkill}</span>?
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                placeholder="Search topics..."
                                className="pl-10 h-11 rounded-xl border-slate-200 bg-white shadow-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 bg-white shadow-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-colors">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </FadeIn>

                {/* 2. Main Stats Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StaggerItem>
                        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Daily Streak</CardTitle>
                                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold text-slate-900">12 Days</div>
                                <p className="text-xs text-slate-500 font-medium mt-1">Top 5% of learners</p>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hours Learned</CardTitle>
                                <Clock className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold text-slate-900">48.5h</div>
                                <p className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +2.5h this week
                                </p>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Modules Done</CardTitle>
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold text-slate-900">8/12</div>
                                <div className="mt-2">
                                    <Progress value={66} className="h-2 bg-slate-100" />
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Current Level</CardTitle>
                                <Trophy className="h-5 w-5 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold text-slate-900">Elite</div>
                                <p className="text-xs text-slate-500 font-medium mt-1">Next: Master (120 XP)</p>
                            </CardContent>
                        </Card>
                    </StaggerItem>
                </StaggerContainer>

                {/* 3. Continue Learning 'Hero' Card */}
                <FadeIn delay={0.2}>
                    <HoverCard>
                        <Card className="group relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-slate-900 text-white">
                            {/* Abstract Decorative Background */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-600/30 to-violet-600/30 blur-3xl opacity-50 rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

                            <CardContent className="p-8 md:p-10 relative z-10">
                                <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                                    <div className="space-y-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-indigo-200">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                            InProgress
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                                Active Session: <br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">{data.targetSkill} Fundamentals</span>
                                            </h2>
                                            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                                                Your personalized AI curriculum is ready. Start your journey to becoming an expert in {data.targetSkill}.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6 pt-2">
                                            <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-base shadow-xl shadow-indigo-900/20 hover:scale-105 transition-all duration-300">
                                                <Play className="w-5 h-5 mr-2 fill-current" /> Start Learning
                                            </Button>
                                            <div className="hidden md:block text-slate-400 font-medium text-sm">
                                                ~4 weeks to goal
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Ring (Visual) */}
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="64" cy="64" r="58" className="stroke-white/10" strokeWidth="8" fill="none" />
                                            <circle cx="64" cy="64" r="58" className="stroke-indigo-400" strokeWidth="8" fill="none" strokeDasharray="364" strokeDashoffset="0" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-3xl font-black">0%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </HoverCard>
                </FadeIn>

                {/* 4. Recent Modules List */}
                <div className="space-y-6">
                    <FadeIn delay={0.3} className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-slate-400" />
                            Your Learning Path
                        </h3>
                        <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                            View Full Curriculum -&gt;
                        </Button>
                    </FadeIn>

                    <StaggerContainer delay={0.4} className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <StaggerItem key={i}>
                                <div className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex items-center gap-5 cursor-pointer">
                                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-105 transition-all duration-300">
                                        <span className="text-2xl font-black text-slate-300 group-hover:text-indigo-500 transition-colors">0{i}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors text-lg">
                                                {i === 1 ? `Introduction to ${data.targetSkill}` : i === 2 ? `Intermediate ${data.targetSkill}` : `Advanced ${data.targetSkill} Concepts`}
                                            </h4>
                                            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500 uppercase">Module {i}</span>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium line-clamp-1">
                                            Core concepts and practical applications of {data.targetSkill} for {data.currentLevel || 'beginners'}.
                                        </p>
                                    </div>
                                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> 2h 15m
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Today
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ResourceModal moduleTitle={i === 1 ? `Introduction to ${data.targetSkill}` : i === 2 ? `Intermediate ${data.targetSkill}` : `Advanced ${data.targetSkill}`} />
                                        <QuizModal moduleTitle={i === 1 ? `Introduction to ${data.targetSkill}` : i === 2 ? `Intermediate ${data.targetSkill}` : `Advanced ${data.targetSkill}`} />
                                        <Button size="icon" variant="ghost" className="text-slate-400 group-hover:translate-x-1 transition-transform">
                                            <Play className="w-5 h-5 fill-current" />
                                        </Button>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>

                {/* 5. Schedule Section */}
                <FadeIn delay={0.5}>
                    <div className="flex items-center justify-between mb-6 mt-12">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            Smart Schedule
                        </h3>
                    </div>
                    <CalendarView />
                </FadeIn>
            </div>
        </main>
    )
}
