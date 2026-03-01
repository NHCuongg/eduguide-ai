'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Star, Lock, MapPin } from "lucide-react"
import { motion } from "framer-motion"

const mapNodes = [
    { id: 1, level: "4.0", title: "Foundations", status: "completed", x: 50, y: 85 },
    { id: 2, level: "5.0", title: "Core Concepts", status: "completed", x: 75, y: 65 },
    { id: 3, level: "6.0", title: "Advanced Logic", status: "active", x: 25, y: 45 },
    { id: 4, level: "6.5+", title: "Mastery", status: "locked", x: 60, y: 20 },
    { id: 5, level: "Goal", title: "Certification", status: "locked", x: 50, y: 5 },
]

export default function GamifiedMap() {
    return (
        <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center py-20">

            {}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px]" />
                {}
                <div className="absolute top-10 left-20 w-1 h-1 bg-white/70 rounded-full animate-pulse" />
                <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-blue-200/50 rounded-full animate-pulse delay-700" />
                <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300" />
            </div>

            {}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-64 h-24 bg-white/5 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [0, -30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-0 w-80 h-32 bg-blue-400/5 rounded-full blur-3xl"
                />
            </div>

            {}
            <div className="relative w-full max-w-3xl h-full flex-1 z-20 overflow-y-auto scrollbar-none pb-20">

                <div className="relative w-full h-[1200px]"> {}
                    {}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>

                        <path
                            d="M 50% 90% Q 90% 80% 75% 65% T 25% 40% T 60% 15% T 50% 5%"
                            fill="none"
                            stroke="url(#pathGradient)"
                            strokeWidth="6"
                            strokeDasharray="12 8"
                            strokeLinecap="round"
                            className="animate-pulse"
                        />
                    </svg>

                    {}
                    {mapNodes.map((node) => {
                        const isCompleted = node.status === 'completed'
                        const isActive = node.status === 'active'

                        const yPos = node.id === 1 ? 90 : 
                            node.id === 2 ? 65 :
                                node.id === 3 ? 40 :
                                    node.id === 4 ? 15 :
                                        5 

                        return (
                            <motion.div
                                key={node.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${node.x}%`, top: `${yPos}%` }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: node.id * 0.5 }}
                            >
                                <div className="group relative">
                                    <div className={cn(
                                        "absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 shadow-lg border",
                                        isActive ? "bg-white text-indigo-900 border-white scale-110 z-20" : "bg-slate-900/80 text-slate-300 border-slate-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                    )}>
                                        {node.title}
                                    </div>
                                    <div className={cn(
                                        "w-24 h-24 rounded-full flex items-center justify-center relative transition-all duration-500 cursor-pointer",
                                        isActive ? "shadow-[0_0_50px_rgba(99,102,241,0.6)] scale-110" : "hover:scale-105"
                                    )}>
                                        <div className={cn(
                                            "absolute inset-0 rounded-full border-4 shadow-xl overflow-hidden",
                                            isCompleted ? "bg-emerald-500 border-emerald-300" :
                                                isActive ? "bg-indigo-500 border-white ring-4 ring-indigo-500/30" :
                                                    "bg-slate-700 border-slate-600"
                                        )}>
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/10" />
                                        </div>
                                        <div className="relative z-10 text-white font-black text-xl flex flex-col items-center">
                                            {isCompleted ? <Star className="h-8 w-8 fill-yellow-400 text-yellow-400 drop-shadow-md" /> :
                                                isActive ? <span className="text-2xl drop-shadow-md">{node.level}</span> :
                                                    <Lock className="h-6 w-6 text-slate-400" />
                                            }
                                        </div>
                                        {isActive && (
                                            <>
                                                <div className="absolute -inset-4 border border-white/20 rounded-full animate-ping opacity-20" />
                                                <div className="absolute -inset-8 border border-white/10 rounded-full animate-ping opacity-10 delay-300" />
                                            </>
                                        )}
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 rounded-full -z-10 blur-sm brightness-50",
                                        isCompleted ? "bg-emerald-800" : isActive ? "bg-indigo-800" : "bg-slate-800"
                                    )} />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {}
            <Button
                className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-full h-12 px-6 shadow-2xl z-50 transition-all font-bold group"
            >
                <MapPin className="mr-2 h-4 w-4 text-indigo-400 group-hover:text-indigo-300" />
                Return to Base
            </Button>
        </div>
    )
}
