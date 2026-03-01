'use client'

import { useEffect } from 'react'
import { usePomodoroStore } from '@/lib/usePomodoroStore'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Coffee, Brain, Armchair } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PomodoroTimer() {
    const {
        timeLeft,
        isRunning,
        mode,
        startTimer,
        pauseTimer,
        resetTimer,
        setMode,
        tick
    } = usePomodoroStore()

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                tick()
            }, 1000)
        } else if (timeLeft === 0) {
            pauseTimer()
            
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, timeLeft, tick, pauseTimer])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                        <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Focus Timer
                </h3>
                <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setMode('focus')}
                        className={cn(
                            "p-2.5 rounded-lg transition-all duration-300",
                            mode === 'focus'
                                ? "bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400 scale-105"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        )}
                        title="Focus"
                    >
                        <Brain className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setMode('shortBreak')}
                        className={cn(
                            "p-2.5 rounded-lg transition-all duration-300",
                            mode === 'shortBreak'
                                ? "bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400 scale-105"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        )}
                        title="Short Break"
                    >
                        <Coffee className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setMode('longBreak')}
                        className={cn(
                            "p-2.5 rounded-lg transition-all duration-300",
                            mode === 'longBreak'
                                ? "bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400 scale-105"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        )}
                        title="Long Break"
                    >
                        <Armchair className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
                <div className="relative mb-8">
                    <div className={cn(
                        "absolute inset-0 rounded-full blur-2xl opacity-30 transition-all duration-500",
                        isRunning ? "bg-amber-500 animate-pulse" : "bg-indigo-500"
                    )} />
                    <div className="relative text-7xl font-mono font-black text-slate-900 dark:text-white tracking-wider">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={resetTimer}
                        className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-110 transition-all shadow-sm hover:shadow-md"
                    >
                        <RotateCcw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </Button>

                    <Button
                        size="lg"
                        onClick={isRunning ? pauseTimer : startTimer}
                        className={cn(
                            "w-20 h-20 rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95",
                            isRunning
                                ? "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                                : "bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                        )}
                    >
                        {isRunning ? (
                            <Pause className="w-10 h-10 fill-current" />
                        ) : (
                            <Play className="w-10 h-10 fill-current ml-1" />
                        )}
                    </Button>
                </div>

                <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {mode === 'focus' ? '⏱️ Time to focus!' : mode === 'shortBreak' ? '☕ Take a short break.' : '🛋️ Take a long break.'}
                    </p>
                </div>
            </div>
        </div>
    )
}
