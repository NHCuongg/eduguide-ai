'use client'

import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Zap, Bell, Clock, MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function RightWidgets() {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isActive, timeLeft])

    const toggleTimer = () => setIsActive(!isActive)
    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(25 * 60)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="w-[300px] border-l border-slate-200 bg-white p-6 hidden xl:flex flex-col h-[calc(100vh-60px)]">

            {/* Focus Timer Section - NEW */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" /> Focus Timer
                    </h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-200">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="text-5xl font-mono font-bold tracking-wider mb-2">{formatTime(timeLeft)}</div>
                        <div className="text-slate-400 text-sm font-medium">
                            {isActive ? "Focusing..." : "Deep Focus Mode"}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <Button
                            onClick={toggleTimer}
                            className={cn(
                                "text-white border-0 transition-all",
                                isActive ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"
                            )}
                        >
                            {isActive ? "Pause" : "Start"}
                        </Button>
                        <Button
                            onClick={resetTimer}
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            Reset
                        </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                        <span>Sessions today: <b>0/4</b></span>
                        <span>Streak: <b>5</b> 🔥</span>
                    </div>
                </div>
            </div>

            {/* Progress Stats (Compact) */}
            <div className="mb-8 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Daily Goal</span>
                    <span className="font-bold text-slate-900">85%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-green-500 rounded-full" />
                </div>
            </div>

            {/* Daily Goals / Notifications */}
            <div className="mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Daily Focus</h3>
                <div className="bg-red-50 text-red-900 rounded-xl p-4 flex items-start gap-3 border border-red-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Bell className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">3 Overdue Sessions</div>
                        <div className="text-xs text-red-700/80 mt-1">Try to catch up this weekend to stay on track.</div>
                    </div>
                </div>
            </div>

            {/* Mascot Area */}
            <div className="mt-auto bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 transition-shadow">
                <div className="relative z-10">
                    <h3 className="font-extrabold text-xl mb-2 tracking-tight">Keep it up! 🔥</h3>
                    <p className="text-indigo-100 text-sm mb-5 leading-relaxed font-medium">Consistency is the key to mastery. Complete today's session to earn a streak.</p>
                    <Button size="sm" className="bg-white text-indigo-700 hover:bg-indigo-50 w-full font-bold shadow-md hover:shadow-lg transition-all border border-indigo-100">
                        Continue Learning
                    </Button>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/30 rounded-full blur-xl" />
            </div>
        </div>
    )
}
