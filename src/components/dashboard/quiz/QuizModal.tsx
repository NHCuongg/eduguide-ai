'use client'

import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// Removed unused imports
import { useGamificationStore } from "@/lib/useGamificationStore"
import { showToast } from "@/lib/toast"

interface Question {
    id: number
    text: string
    options: string[]
    correctAnswer: string
}

export function QuizModal({ moduleTitle, difficulty = "Intermediate" }: { moduleTitle: string, difficulty?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [showResult, setShowResult] = useState(false)

    const fetchQuiz = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: moduleTitle, skillLevel: difficulty })
            })
            if (!res.ok) {
                const errorData = await res.json()
                if (res.status === 429) {
                    showToast.error('Rate limit exceeded', `Please wait ${errorData.retryAfter || 60} seconds before trying again`)
                } else {
                    showToast.error('Failed to generate quiz', errorData.error || 'Please try again')
                }
                return
            }
            const data = await res.json()
            if (data.questions) {
                setQuestions(data.questions)
                setScore(0)
                setCurrentQuestion(0)
                setIsFinished(false)
                setSelectedAnswer(null)
                setShowResult(false)
            }
        } catch (error) {
            console.error("Failed to load quiz", error)
            showToast.error('Network error', 'Please check your connection and try again')
        } finally {
            setLoading(false)
        }
    }, [moduleTitle, difficulty])

    const handleAnswer = useCallback(() => {
        setShowResult(true)
        if (selectedAnswer === questions[currentQuestion]?.correctAnswer) {
            setScore(s => s + 1)
        }
    }, [selectedAnswer, questions, currentQuestion])

    const nextQuestion = useCallback(() => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setIsFinished(true)
        }
    }, [currentQuestion, questions.length])

    const currentQuestionData = useMemo(() => {
        return questions[currentQuestion]
    }, [questions, currentQuestion])

    const isLastQuestion = useMemo(() => {
        return currentQuestion === questions.length - 1
    }, [currentQuestion, questions.length])

    const { addXP } = useGamificationStore()
    const [xpClaimed, setXpClaimed] = useState(false)

    const handleClaimXP = () => {
        if (!xpClaimed) {
            addXP(score * 10)
            setXpClaimed(true)
        }
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 font-semibold transition-all hover:scale-105"
                    onClick={fetchQuiz}
                >
                    <Trophy className="w-4 h-4 mr-2" /> Test Knowledge
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                            <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Quiz: {moduleTitle}</span>
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400 relative" />
                        </div>
                        <p className="font-medium text-lg">AI is generating custom questions...</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">This may take a few seconds</p>
                    </div>
                ) : isFinished ? (
                    <div className="text-center py-8">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                            <div className="relative w-full h-full bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center shadow-2xl">
                                <Trophy className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Quiz Completed!</h3>
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-200 dark:border-indigo-800 mb-6">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">You scored</span>
                            <span className="font-black text-3xl text-indigo-600 dark:text-indigo-400">{score}/{questions.length}</span>
                        </div>
                        <Button 
                            onClick={handleClaimXP} 
                            className="w-full h-12 text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Claim {score * 10} XP & Close
                        </Button>
                    </div>
                ) : questions.length > 0 ? (
                    <div className="space-y-6 py-4">
                        <div className="flex justify-between items-center px-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Question {currentQuestion + 1} of {questions.length}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Score: {score}</span>
                            </div>
                        </div>

                        <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed px-2">
                            {questions[currentQuestion].text}
                        </div>

                        <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-3">
                            {questions[currentQuestion].options.map((option, idx) => {
                                const isCorrect = showResult && option === questions[currentQuestion].correctAnswer
                                const isWrong = showResult && selectedAnswer === option && option !== questions[currentQuestion].correctAnswer
                                const isSelected = selectedAnswer === option
                                
                                return (
                                    <div 
                                        key={idx} 
                                        className={cn(
                                            "flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all duration-300",
                                            isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20",
                                            isWrong && "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/20",
                                            isSelected && !showResult && "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md",
                                            !isSelected && !showResult && "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        <RadioGroupItem value={option} id={`option-${idx}`} disabled={showResult} className="border-2" />
                                        <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer font-medium text-slate-700 dark:text-slate-200">
                                            {option}
                                        </Label>
                                        {isCorrect && <span className="text-green-600 dark:text-green-400 font-bold">✓</span>}
                                        {isWrong && <span className="text-red-600 dark:text-red-400 font-bold">✗</span>}
                                    </div>
                                )
                            })}
                        </RadioGroup>

                        <div className="flex justify-end pt-4">
                            {!showResult ? (
                                <Button 
                                    onClick={handleAnswer} 
                                    disabled={!selectedAnswer}
                                    className="h-11 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Check Answer
                                </Button>
                            ) : (
                                <Button 
                                    onClick={nextQuestion}
                                    className="h-11 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                >
                                    {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                        <p className="font-medium text-lg mb-2">Failed to load quiz</p>
                        <p className="text-sm">Please try again</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
