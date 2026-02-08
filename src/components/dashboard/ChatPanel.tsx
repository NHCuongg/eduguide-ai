'use client'

import { useState, useRef, useEffect } from "react"
import { useWizardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Send,
    GraduationCap,
    Sparkles,
    BookOpen,
    BrainCircuit,
    HelpCircle,
    ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type Message = {
    role: 'assistant' | 'user'
    content: string
    type?: 'text' | 'suggestion'
}

export default function ChatPanel() {
    const { activeModuleId, roadmap } = useWizardStore()
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Welcome to your workspace! I'm your AI Teaching Assistant. I'm here to help you master this material."
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Context Awareness Logic
    const currentContext = activeModuleId ? (() => {
        const [p, m] = activeModuleId.split('-').map(Number)
        return roadmap?.phases[p]?.modules[m]?.title || "General"
    })() : "General"

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Proactive Suggestions based on Context
    const suggestions = [
        { label: "Summerize this lesson", icon: BookOpen, prompt: `Can you summarize the key takeaways from ${currentContext}?` },
        { label: "Create a micro-quiz", icon: BrainCircuit, prompt: `Generate 3 multiple-choice questions about ${currentContext} to test my understanding.` },
        { label: "Explain like I'm 5", icon: HelpCircle, prompt: `Explain the concept of ${currentContext} in simple terms.` },
    ]

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return

        // 1. Add User Message
        setMessages(prev => [...prev, { role: 'user', content: text }])
        setInputValue("")
        setIsTyping(true)

        // 2. Simulate AI Thinking & Response (Mock API Call)
        setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `(AI Context: ${currentContext})\n\nThat's a great question! Based on the current lesson material, here's what you need to know...\n\n[Real AI integration coming in Sprint 2]`
            }])
        }, 1500)
    }

    return (
        <div className="w-96 border-l-2 border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 h-[calc(100vh-60px)] flex flex-col shadow-2xl z-20">
            {/* Header: The Persona */}
            <div className="p-5 border-b-2 border-slate-100 dark:border-slate-800 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-800 shadow-md">
                            <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 shadow-md"></span>
                    </div>
                    <div>
                        <h2 className="font-serif font-black text-lg text-slate-900 dark:text-white leading-none">EduMate AI</h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Teaching Assistant</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30 p-5 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className={cn(
                            "flex gap-3 max-w-[90%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        {msg.role === 'assistant' && (
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center shrink-0 mt-1 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        )}

                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-md",
                            msg.role === 'user'
                                ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-700 rounded-tl-sm"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center shrink-0 mt-1 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm border-2 border-slate-100 dark:border-slate-700 shadow-md">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Proactive Suggestions (Context Aware) */}
            <div className="px-5 py-3 bg-gradient-to-r from-slate-50/80 to-white dark:from-slate-800/50 dark:to-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-2.5 tracking-wider pl-1">Suggested Actions</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSendMessage(s.prompt)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-all whitespace-nowrap shadow-sm hover:shadow-md hover:scale-105"
                        >
                            <s.icon className="h-3.5 w-3.5" />
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-5 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border-t-2 border-slate-100 dark:border-slate-800">
                <form
                    className="relative flex items-center"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Ask about "${currentContext}"...`}
                        className="pr-12 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus-visible:ring-indigo-500 rounded-xl shadow-sm"
                    />
                    <Button
                        size="icon"
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-1.5 h-9 w-9 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
