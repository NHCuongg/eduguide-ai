'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Flashcard } from './Flashcard'
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Loader2 } from 'lucide-react'
import { showToast } from '@/lib/toast'
import { AnimatePresence, motion } from 'framer-motion'

interface Card {
    front: string
    back: string
}

export function FlashcardDeck() {
    const [topic, setTopic] = useState('')
    const [cards, setCards] = useState<Card[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [loading, setLoading] = useState(false)

    const generateCards = useCallback(async () => {
        if (!topic.trim()) {
            showToast.warning('Please enter a topic')
            return
        }
        setLoading(true)
        try {
            const response = await fetch('/api/generate-flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (response.status === 429) {
                    showToast.error('Rate limit exceeded', `Please wait ${errorData.retryAfter || 60} seconds before trying again`)
                } else {
                    showToast.error('Failed to generate flashcards', errorData.error || 'Please try again')
                }
                return
            }

            const data = await response.json()
            if (data.flashcards) {
                setCards(data.flashcards)
                setCurrentIndex(0)
                setIsFlipped(false)
                showToast.success(`Generated ${data.flashcards.length} flashcards!`)
            }
        } catch (error) {
            console.error(error)
            showToast.error('Network error', 'Please check your connection and try again')
        } finally {
            setLoading(false)
        }
    }, [topic])

    const handleNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false)
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200)
        }
    }, [currentIndex, cards.length])

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setIsFlipped(false)
            setTimeout(() => setCurrentIndex(prev => prev - 1), 200)
        }
    }, [currentIndex])

    const progressPercentage = useMemo(() => {
        return cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0
    }, [currentIndex, cards.length])

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto py-6">
            <div className="mb-8 text-center space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        AI Flashcards
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Generate personalized study cards instantly</p>
                </div>

                {cards.length === 0 && (
                    <div className="flex gap-3 max-w-md mx-auto">
                        <div className="relative flex-1 group">
                            <Input
                                placeholder="Enter a topic (e.g., Photosynthesis)"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && generateCards()}
                                className="h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-600 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                        </div>
                        <Button 
                            onClick={generateCards} 
                            disabled={loading} 
                            className="h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 mr-2" /> Generate</>}
                        </Button>
                    </div>
                )}
            </div>

            {loading && cards.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
                        <Loader2 className="w-14 h-14 animate-spin text-indigo-600 dark:text-indigo-400 relative" />
                    </div>
                    <p className="font-semibold text-base mb-1">Generating focused study cards...</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">This may take a few seconds</p>
                    <div className="mt-4 flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {cards.length > 0 && (
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center justify-between w-full px-4 text-sm font-semibold">
                        <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                            Card {currentIndex + 1} of {cards.length}
                        </span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setCards([])} 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                        >
                            Reset Deck
                        </Button>
                    </div>

                    <div className="w-full">
                        <Flashcard
                            front={cards[currentIndex].front}
                            back={cards[currentIndex].back}
                            isFlipped={isFlipped}
                            onClick={() => setIsFlipped(!isFlipped)}
                        />
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="rounded-full w-14 h-14 p-0 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </Button>
                        <div className="flex-1 max-w-xs">
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-500 rounded-full shadow-lg shadow-indigo-500/50"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleNext}
                            disabled={currentIndex === cards.length - 1}
                            className="rounded-full w-14 h-14 p-0 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-sm hover:shadow-md"
                        >
                            <ArrowRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
