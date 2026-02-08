'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FlashcardProps {
    front: string
    back: string
    isFlipped: boolean
    onClick: () => void
}

export function Flashcard({ front, back, isFlipped, onClick }: FlashcardProps) {
    return (
        <div
            className="relative w-full h-[350px] cursor-pointer perspective-1000 group"
            onClick={onClick}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.02 }}
            >
                {/* Front */}
                <div className={cn(
                    "absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-8 text-center group-hover:shadow-indigo-500/20 transition-shadow duration-300",
                )}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="absolute top-4 right-4">
                        <div className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Question</span>
                        </div>
                    </div>
                    <p className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 leading-relaxed max-w-lg">
                        {front}
                    </p>
                    <div className="absolute bottom-6 flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                        <span className="animate-pulse">👆</span>
                        <span>Tap to flip</span>
                    </div>
                </div>

                {/* Back */}
                <div className={cn(
                    "absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-2xl border-2 border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/50 dark:via-violet-950/50 dark:to-purple-950/50 flex flex-col items-center justify-center p-8 text-center group-hover:shadow-indigo-500/30 transition-shadow duration-300",
                )}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="absolute top-4 right-4">
                        <div className="px-3 py-1 rounded-full bg-indigo-200 dark:bg-indigo-800/50 border border-indigo-300 dark:border-indigo-700">
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Answer</span>
                        </div>
                    </div>
                    <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed max-w-lg">
                        {back}
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
