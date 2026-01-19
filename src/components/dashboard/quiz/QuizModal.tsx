'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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

    const fetchQuiz = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/generate-quiz', {
                method: 'POST',
                body: JSON.stringify({ topic: moduleTitle, skillLevel: difficulty })
            })
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
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = () => {
        setShowResult(true)
        if (selectedAnswer === questions[currentQuestion].correctAnswer) {
            setScore(s => s + 1)
        }
    }

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setIsFinished(true)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={fetchQuiz}
                >
                    <Trophy className="w-4 h-4 mr-2" /> Test Knowledge
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-indigo-500" />
                        Quiz: {moduleTitle}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                        <p>AI is generating custom questions...</p>
                    </div>
                ) : isFinished ? (
                    <div className="text-center py-6">
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-12 h-12 text-yellow-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                        <p className="text-slate-600 mb-6">
                            You scored <span className="font-bold text-indigo-600 text-xl">{score}/{questions.length}</span>
                        </p>
                        <Button onClick={() => setIsOpen(false)} className="w-full">
                            Claim {score * 10} XP & Close
                        </Button>
                    </div>
                ) : questions.length > 0 ? (
                    <div className="space-y-6 py-4">
                        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>Score: {score}</span>
                        </div>

                        <div className="text-lg font-medium text-slate-900">
                            {questions[currentQuestion].text}
                        </div>

                        <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-3">
                            {questions[currentQuestion].options.map((option, idx) => (
                                <div key={idx} className={cn(
                                    "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors",
                                    selectedAnswer === option ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50",
                                    showResult && option === questions[currentQuestion].correctAnswer && "border-green-500 bg-green-50",
                                    showResult && selectedAnswer === option && option !== questions[currentQuestion].correctAnswer && "border-red-500 bg-red-50"
                                )}>
                                    <RadioGroupItem value={option} id={`option-${idx}`} disabled={showResult} />
                                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer font-normal">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <div className="flex justify-end pt-4">
                            {!showResult ? (
                                <Button onClick={handleAnswer} disabled={!selectedAnswer}>
                                    Check Answer
                                </Button>
                            ) : (
                                <Button onClick={nextQuestion}>
                                    {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p>Failed to load quiz. Please try again.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
