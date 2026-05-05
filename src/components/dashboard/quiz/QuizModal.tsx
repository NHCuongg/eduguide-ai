'use client'

import { useState, useCallback, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { useGamificationStore } from "@/lib/useGamificationStore"
import { showToast } from "@/lib/toast"
import { useAsyncJob } from "@/lib/useAsyncJob"

interface Question {
    id: number
    text: string
    options: string[]
    correctAnswer: string
}

interface QuizResult {
    questions: Question[]
}

interface QuizModalProps {
    moduleTitle: string
    difficulty?: string
    trigger?: ReactNode
}

export function QuizModal({ moduleTitle, difficulty = "Intermediate", trigger }: QuizModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [showResult, setShowResult] = useState(false)

    const { state, submit } = useAsyncJob<{ topic: string; skillLevel: string }, QuizResult>({
        endpoint: '/api/generate-quiz',
        buildBody: (input) => input,
    })
    const loading = state.status === 'queued' || state.status === 'active'

    const fetchQuiz = useCallback(async () => {
        try {
            const result = await submit({ topic: moduleTitle, skillLevel: difficulty })
            if (!result?.questions?.length) {
                showToast.error('Failed to generate quiz', 'Empty response')
                return
            }
            setQuestions(result.questions)
            setScore(0)
            setCurrentQuestion(0)
            setIsFinished(false)
            setSelectedAnswer(null)
            setShowResult(false)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Please try again'
            showToast.error('Failed to generate quiz', message)
        }
    }, [moduleTitle, difficulty, submit])

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
            <DialogTrigger asChild onClick={fetchQuiz}>
                {trigger ?? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg gap-2 font-semibold"
                    >
                        <Trophy className="w-4 h-4" /> Quiz
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                            <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Quiz · {moduleTitle}</span>
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
                        <h3 className="text-3xl font-semibold tracking-tight mb-3 text-slate-900 dark:text-white">Done.</h3>
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-200 dark:border-indigo-800 mb-6">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">You scored</span>
                            <span className="font-black text-3xl text-indigo-600 dark:text-indigo-400">{score}/{questions.length}</span>
                        </div>
                        <Button
                            onClick={handleClaimXP}
                            size="lg"
                            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700"
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
                                    size="lg"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700"
                                >
                                    Check Answer
                                </Button>
                            ) : (
                                <Button
                                    onClick={nextQuestion}
                                    size="lg"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700"
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
