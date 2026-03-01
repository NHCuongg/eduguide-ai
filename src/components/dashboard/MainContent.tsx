'use client';

import { useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useWizardStore } from "@/lib/store"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, TrendingUp, Calendar, Zap, BookOpen, Search, Filter, MoreHorizontal, Clock, CheckCircle2, Trophy, Hammer } from "lucide-react"
import { StaggerContainer, StaggerItem, HoverCard, FadeIn } from "@/components/ui/motion-primitives"
import dynamic from "next/dynamic"
import { ExportButton } from "./export/ExportButton"
import { useGamificationStore, getLevelTitle, getNextLevelXP } from "@/lib/useGamificationStore"

const QuizModal = dynamic(() => import("./quiz/QuizModal").then(mod => mod.QuizModal), { ssr: false })
const CalendarView = dynamic(() => import("./schedule/CalendarView").then(mod => mod.CalendarView), { ssr: false })
const ResourceModal = dynamic(() => import("./resources/ResourceModal").then(mod => mod.ResourceModal), { ssr: false })

const PomodoroTimer = dynamic(() => import("./pomodoro/PomodoroTimer").then(mod => mod.PomodoroTimer), { ssr: false })
const NotesPanel = dynamic(() => import("./notes/NotesPanel").then(mod => mod.NotesPanel), { ssr: false })
const FlashcardDeck = dynamic(() => import("./flashcards/FlashcardDeck").then(mod => mod.FlashcardDeck), { ssr: false })

export default function MainContent() {
    const router = useRouter()
    const { data } = useWizardStore()
    const { xp, level, streak, checkStreak } = useGamificationStore()

    const progressPercentage = useMemo(() => {
        return Math.min(100, Math.round((xp / getNextLevelXP(level)) * 100))
    }, [xp, level])

    const progressValue = useMemo(() => {
        return (xp / getNextLevelXP(level)) * 100
    }, [xp, level])

    const strokeDashoffset = useMemo(() => {
        return 364 - (364 * progressPercentage) / 100
    }, [progressPercentage])

    const handleRedirect = useCallback(() => {
        if (!data?.targetSkill) {
            router.push("/onboarding")
        }
    }, [data?.targetSkill, router])

    useEffect(() => {
        checkStreak()
    }, [checkStreak])

    useEffect(() => {
        handleRedirect()
    }, [handleRedirect])

    if (!data?.targetSkill) return null 

    return (
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 xl:p-10 scroll-smooth">
            <div className="max-w-6xl mx-auto space-y-10">

                {}
                <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-serif mb-2">
                            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Learner</span>
                        </h1>
                        <p className="text-slate-700 dark:text-slate-200 font-semibold text-lg">
                            Ready to continue your mastery in <span className="text-indigo-700 dark:text-indigo-400 font-bold">{data.targetSkill}</span>?
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <ExportButton />
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors z-10" />
                            <input
                                placeholder="Search topics..."
                                className="pl-11 pr-4 h-12 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 w-full md:w-72 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                            <Filter className="w-5 h-5" />
                        </Button>
                    </div>
                </FadeIn>

                {}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StaggerItem>
                        <Card className="rounded-3xl border-none shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20 card-hover card-glow overflow-hidden relative h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                                <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Daily Streak</CardTitle>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 group-hover:from-amber-500 group-hover:to-amber-600 dark:group-hover:from-amber-500 dark:group-hover:to-amber-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:text-white group-hover:fill-current transition-all duration-300" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{streak} <span className="text-lg text-slate-400 dark:text-slate-500 font-semibold">Days</span></div>
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-2 flex items-center gap-2 px-2 py-1 rounded-lg bg-amber-100/50 dark:bg-amber-900/30 w-fit">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50" />
                                    On fire! Keep it up!
                                </p>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="rounded-3xl border-none shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 card-hover card-glow overflow-hidden relative h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                                <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Hours Learned</CardTitle>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 group-hover:from-blue-500 group-hover:to-blue-600 dark:group-hover:from-blue-500 dark:group-hover:to-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:text-white transition-all duration-300" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">48.5<span className="text-lg text-slate-400 dark:text-slate-500 font-semibold">h</span></div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 inline-flex items-center px-2 py-1 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/30">
                                    <TrendingUp className="w-3 h-3 mr-1.5" /> +2.5h this week
                                </p>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="rounded-3xl border-none shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 card-hover card-glow overflow-hidden relative h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 dark:bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                                <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Modules Done</CardTitle>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 group-hover:from-emerald-500 group-hover:to-emerald-600 dark:group-hover:from-emerald-500 dark:group-hover:to-emerald-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-all duration-300" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">8<span className="text-xl text-slate-300 dark:text-slate-600 font-normal">/</span>12</div>
                                <div className="mt-3">
                                    <Progress value={66} className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden" indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/50" />
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="rounded-3xl border-none shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-gradient-to-br from-white to-fuchsia-50/30 dark:from-slate-900 dark:to-fuchsia-950/20 card-hover card-glow overflow-hidden relative h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-200/20 dark:bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                                <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">Current Level</CardTitle>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 dark:from-fuchsia-900/50 dark:to-fuchsia-800/50 group-hover:from-fuchsia-500 group-hover:to-fuchsia-600 dark:group-hover:from-fuchsia-500 dark:group-hover:to-fuchsia-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <Trophy className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400 group-hover:text-white transition-all duration-300" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate mb-2">{getLevelTitle(level)}</div>
                                <div className="flex items-center justify-between mt-2 mb-2">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Lvl {level}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{xp}/{getNextLevelXP(level)} XP</p>
                                </div>
                                <Progress value={progressValue} className="h-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-full overflow-hidden" indicatorClassName="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 rounded-full shadow-lg shadow-fuchsia-500/50" />
                            </CardContent>
                        </Card>
                    </StaggerItem>
                </StaggerContainer>

                {}
                <FadeIn delay={0.2}>
                    <HoverCard>
                        <Card className="group relative overflow-hidden border-none shadow-2xl hover:shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all duration-500 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white isolate">
                            {}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-slate-900 to-slate-900" />
                            <div className="absolute inset-0 opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-125 brightness-100" />

                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700 animate-pulse" />
                            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl mix-blend-overlay animate-float" />

                            <CardContent className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
                                <div className="space-y-8 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-xs font-bold uppercase tracking-widest text-indigo-200 shadow-inner">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_currentColor]" />
                                        In Progress
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                                            Continue your <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200 animate-gradient-x">{data.targetSkill} Fundamentals</span>
                                        </h2>
                                        <p className="text-indigo-100/70 text-lg leading-relaxed font-medium max-w-lg">
                                            Your personalized AI curriculum is ready. Dive back in to reach your daily goal.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6">
                                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-gradient-to-r from-white to-indigo-50 text-indigo-950 hover:from-indigo-50 hover:to-indigo-100 font-bold text-lg shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(255,255,255,0.4)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-2 border-white/20">
                                            <Play className="w-6 h-6 mr-3 fill-indigo-600 text-indigo-600" /> Resume Learning
                                        </Button>
                                        <div className="flex items-center gap-3 text-indigo-200/80 font-medium px-4 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                            <Calendar className="w-4 h-4" />
                                            <span>~4 weeks left</span>
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className="relative group-hover:scale-105 transition-transform duration-500">
                                    <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
                                        {}
                                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />

                                        <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                            <circle cx="50%" cy="50%" r="42%" className="stroke-indigo-950" strokeWidth="12" fill="none" />
                                            <circle
                                                cx="50%" cy="50%" r="42%"
                                                className="stroke-indigo-500"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray="364"
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-5xl font-black tracking-tighter text-white drop-shadow-lg">{progressPercentage}%</span>
                                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-1">Complete</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </HoverCard>
                </FadeIn>

                {}
                <div className="space-y-6">
                    <FadeIn delay={0.25} className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <Hammer className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            Study Tools
                        </h3>
                    </FadeIn>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PomodoroTimer />
                        <NotesPanel />
                    </div>
                    <div className="w-full">
                        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <FlashcardDeck />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {}
                <div className="space-y-6">
                    <FadeIn delay={0.3} className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            Your Learning Path
                        </h3>
                        <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-base">
                            View Full Curriculum {'->'}
                        </Button>
                    </FadeIn>

                    <StaggerContainer delay={0.4} className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <StaggerItem key={i}>
                                <div className="group bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-2xl p-6 border-2 border-slate-100 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-500 flex flex-col md:flex-row items-start md:items-center gap-6 cursor-pointer relative overflow-hidden card-hover">
                                    {}
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg" />
                                    {}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center group-hover:from-indigo-100 group-hover:to-violet-100 dark:group-hover:from-indigo-900/50 dark:group-hover:to-violet-900/50 transition-all duration-300 shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110">
                                        <span className="text-3xl font-black text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">0{i}</span>
                                    </div>
                                    <div className="flex-1 space-y-3 relative z-10">
                                        <div className="flex flex-wrap justify-between items-start gap-2">
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {i === 1 ? `Introduction to ${data.targetSkill}` : i === 2 ? `Intermediate ${data.targetSkill}` : `Advanced ${data.targetSkill} Concepts`}
                                            </h4>
                                            <span className="text-[10px] font-extrabold bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 uppercase tracking-widest border border-slate-200 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 group-hover:from-indigo-100 group-hover:to-violet-100 dark:group-hover:from-indigo-900/50 dark:group-hover:to-violet-900/50 transition-all shadow-sm">Module {i}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed max-w-2xl">
                                            Core concepts and practical applications of {data.targetSkill} for {data.currentLevel || 'beginners'}.
                                        </p>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-400 shrink-0">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50">
                                            <Clock className="w-4 h-4" /> 2h 15m
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-slate-100">
                                        <ResourceModal moduleTitle={i === 1 ? `Introduction to ${data.targetSkill}` : i === 2 ? `Intermediate ${data.targetSkill}` : `Advanced ${data.targetSkill}`} />
                                        <QuizModal moduleTitle={i === 1 ? `Introduction to ${data.targetSkill}` : i === 2 ? `Intermediate ${data.targetSkill}` : `Advanced ${data.targetSkill}`} />
                                        <Button size="icon" variant="ghost" className="hidden md:flex text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                                            <Play className="w-6 h-6 fill-current" />
                                        </Button>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>

                {}
                <FadeIn delay={0.5}>
                    <div className="flex items-center justify-between mb-6 mt-12">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            Smart Schedule
                        </h3>
                    </div>
                    <CalendarView />
                </FadeIn>
            </div>
        </main>
    )
}
