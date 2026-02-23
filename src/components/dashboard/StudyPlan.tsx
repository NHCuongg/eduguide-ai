'use client'

import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    Calendar,
    LayoutGrid,
    List,
    Clock,
    MoreHorizontal,
    Sparkles,
    Zap,
    Circle,
    Search,
    Filter,
    CheckCircle2,
    Play,
    BookOpen,
    TrendingUp,
    ArrowRight,
    X
} from "lucide-react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGamificationStore } from "@/lib/useGamificationStore"

type ViewMode = 'grid' | 'list'
type SortOption = 'default' | 'phase' | 'completed'

export default function StudyPlan() {
    const { roadmap, completedModules, toggleModule, setActiveModule } = useWizardStore()
    const { streak } = useGamificationStore()

    const [activeTab, setActiveTab] = useState<'today' | 'roadmap'>('today')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('default')
    const [showFilters, setShowFilters] = useState(false)

    // Flatten phases to get a list of "Sessions"
    const allSessions = useMemo(() => {
        const sessions = roadmap?.phases?.flatMap((phase, phaseIdx: number) =>
            phase.modules?.map((module, modIdx: number) => ({
                ...module,
                id: `${phaseIdx}-${modIdx}`,
                phaseName: phase.name,
                phaseIdx,
                modIdx,
                isCompleted: completedModules.includes(`${phaseIdx}-${modIdx}`)
            })) || []
        ) || []

        // Filter by search query
        let filtered = sessions
        if (searchQuery.trim()) {
            filtered = sessions.filter(session =>
                session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.phaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Filter by tab
        if (activeTab === 'today') {
            // Show only incomplete sessions for today
            filtered = filtered.filter(s => !s.isCompleted).slice(0, 6)
        }

        // Sort
        if (sortBy === 'phase') {
            filtered = [...filtered].sort((a, b) => a.phaseIdx - b.phaseIdx)
        } else if (sortBy === 'completed') {
            filtered = [...filtered].sort((a, b) => {
                if (a.isCompleted === b.isCompleted) return 0
                return a.isCompleted ? 1 : -1
            })
        }

        return filtered
    }, [roadmap, completedModules, searchQuery, activeTab, sortBy])

    // Calculate progress
    const totalSessions = roadmap?.phases?.reduce((acc, phase) => acc + (phase.modules?.length || 0), 0) || 0
    const completedCount = completedModules.length
    const progressPercentage = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0

    // Find current/next session
    const currentSession = allSessions.find(s => !s.isCompleted) || allSessions[0]

    const handleSessionClick = (sessionId: string) => {
        setActiveModule(sessionId)
        // In a real app, navigate to the module detail page
    }

    return (
        <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
            {/* Header Section */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 md:px-8 py-6 sticky top-0 z-30 transition-all duration-300 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
                                Current Course
                            </div>
                            {roadmap && (
                                <Badge variant="secondary" className="text-xs font-semibold">
                                    {progressPercentage}% Complete
                                </Badge>
                            )}
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {roadmap?.title || 'Advanced AI Engineering'}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="gap-2 hidden md:flex border-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                        >
                            <List className="h-4 w-4" /> Curriculum
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 font-bold"
                            onClick={() => currentSession && handleSessionClick(currentSession.id)}
                        >
                            <Zap className="h-4 w-4 fill-white" /> Smart Resume
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                {roadmap && totalSessions > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Progress
                            </span>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                {completedCount} / {totalSessions} sessions
                            </span>
                        </div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full shadow-lg"
                            />
                        </div>
                    </div>
                )}

                {/* AI Briefing Card */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group hover:shadow-indigo-500/30 transition-all duration-500"
                >
                    <div className="relative z-10 flex items-start gap-5">
                        <div className="p-3.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="h-6 w-6 text-yellow-300" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-xl mb-2 tracking-tight">
                                Good Morning! ☀️
                            </h3>
                            <p className="text-indigo-50 text-sm max-w-2xl leading-relaxed font-medium">
                                You&apos;re on a <span className="font-bold text-white border-b border-white/30">{streak}-day streak</span>!
                                {currentSession
                                    ? ` Continue with "${currentSession.title}" to maintain your momentum.`
                                    : ' Great job completing all sessions!'}
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
                </motion.div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search sessions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "h-11 w-11 border-2 rounded-xl",
                                showFilters && "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700"
                            )}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "h-9 w-9 rounded-lg",
                                    viewMode === 'grid' && "bg-white dark:bg-slate-700 shadow-sm"
                                )}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "h-9 w-9 rounded-lg",
                                    viewMode === 'list' && "bg-white dark:bg-slate-700 shadow-sm"
                                )}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-wrap gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sort:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:border-indigo-500 dark:focus:border-indigo-500"
                                    >
                                        <option value="default">Default</option>
                                        <option value="phase">By Phase</option>
                                        <option value="completed">Completion Status</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interactive Tabs */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setActiveTab('today')}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300",
                                activeTab === 'today'
                                    ? "bg-white dark:bg-slate-700 text-indigo-900 dark:text-indigo-100 shadow-md"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            Today&apos;s Plan
                        </button>
                        <button
                            onClick={() => setActiveTab('roadmap')}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300",
                                activeTab === 'roadmap'
                                    ? "bg-white dark:bg-slate-700 text-indigo-900 dark:text-indigo-100 shadow-md"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            Full Roadmap
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 pb-32 overflow-y-auto h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {allSessions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 px-6"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
                                <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <div className="text-center space-y-3 max-w-md">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                {searchQuery ? 'No results found' : !roadmap ? 'No study plan available' : activeTab === 'today' ? 'All caught up!' : 'No sessions available'}
                            </h3>
                            <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                {searchQuery
                                    ? `No sessions match "${searchQuery}". Try a different search term.`
                                    : !roadmap
                                        ? "You haven&apos;t created a study plan yet. Complete the onboarding to get started!"
                                        : activeTab === 'today'
                                            ? "You've completed all sessions for today! Great work! 🎉"
                                            : "Your study plan is empty. Check back later for new sessions."}
                            </p>
                        </div>
                        {!roadmap && (
                            <Button
                                className="mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                onClick={() => window.location.href = '/onboarding'}
                            >
                                Create Study Plan
                            </Button>
                        )}
                        {searchQuery && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setSearchQuery('')}
                            >
                                Clear Search
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        {viewMode === 'grid' ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {allSessions.map((session, i: number) => {
                                    const isCurrent = session.id === currentSession?.id && !session.isCompleted
                                    return (
                                        <motion.div
                                            key={session.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => handleSessionClick(session.id)}
                                            className={cn(
                                                "rounded-3xl border-2 p-6 transition-all duration-500 relative group cursor-pointer flex flex-col justify-between min-h-[280px]",
                                                session.isCompleted
                                                    ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                                                    : isCurrent
                                                        ? "bg-white dark:bg-slate-900 border-indigo-500 ring-4 ring-indigo-500/10 shadow-2xl shadow-indigo-500/20 scale-[1.02] z-10"
                                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2"
                                            )}
                                        >
                                            {/* Completion Badge */}
                                            {session.isCompleted && (
                                                <div className="absolute top-4 right-4">
                                                    <div className="p-2 rounded-xl bg-green-500 text-white shadow-lg">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Active Indicator */}
                                            {isCurrent && (
                                                <span className="absolute top-4 right-4 flex h-4 w-4">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-white"></span>
                                                </span>
                                            )}

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-base shadow-inner transition-all duration-300",
                                                        session.isCompleted
                                                            ? "bg-green-500 text-white"
                                                            : isCurrent
                                                                ? "bg-indigo-600 text-white shadow-indigo-700/50"
                                                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                                    )}>
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                                                            Session {i + 1}
                                                        </span>
                                                        <span className={cn(
                                                            "text-xs font-bold truncate block",
                                                            isCurrent ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                                                        )}>
                                                            {session.phaseName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h3 className={cn(
                                                    "font-serif font-bold text-lg mb-3 line-clamp-2 leading-snug transition-colors",
                                                    session.isCompleted
                                                        ? "text-green-800 dark:text-green-200"
                                                        : "text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                                                )}>
                                                    {session.title}
                                                </h3>

                                                {session.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                                        {session.description}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                                                        Concept
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                        Practice
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                    <Clock className="h-4 w-4" />
                                                    45m
                                                </div>
                                                {session.isCompleted ? (
                                                    <div className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Completed
                                                    </div>
                                                ) : isCurrent ? (
                                                    <Button
                                                        size="sm"
                                                        className="h-9 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-full px-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleSessionClick(session.id)
                                                        }}
                                                    >
                                                        <Play className="w-3 h-3 mr-1.5 fill-current" />
                                                        Start Now
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {allSessions.map((session, i: number) => {
                                    const isCurrent = session.id === currentSession?.id && !session.isCompleted
                                    return (
                                        <motion.div
                                            key={session.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            onClick={() => handleSessionClick(session.id)}
                                            className={cn(
                                                "rounded-2xl border-2 p-6 transition-all duration-300 group cursor-pointer",
                                                session.isCompleted
                                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                                                    : isCurrent
                                                        ? "bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
                                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-14 w-14 rounded-xl flex items-center justify-center font-black text-lg shadow-inner flex-shrink-0",
                                                    session.isCompleted
                                                        ? "bg-green-500 text-white"
                                                        : isCurrent
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {session.phaseName}
                                                        </span>
                                                        {session.isCompleted && (
                                                            <Badge className="bg-green-500 text-white text-[10px] px-2 py-0">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                Done
                                                            </Badge>
                                                        )}
                                                        {isCurrent && (
                                                            <Badge className="bg-indigo-500 text-white text-[10px] px-2 py-0">
                                                                Current
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className={cn(
                                                        "font-serif font-bold text-lg mb-1",
                                                        session.isCompleted ? "text-green-800 dark:text-green-200" : "text-slate-900 dark:text-slate-100"
                                                    )}>
                                                        {session.title}
                                                    </h3>
                                                    {session.description && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                                                            {session.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 flex-shrink-0">
                                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                                                        <Clock className="h-4 w-4" />
                                                        {session.estimatedTime || "45m"}
                                                    </div>
                                                    {session.isCompleted ? (
                                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                    ) : isCurrent ? (
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold"
                                                        >
                                                            <Play className="w-4 h-4 mr-2 fill-current" />
                                                            Start
                                                        </Button>
                                                    ) : (
                                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
