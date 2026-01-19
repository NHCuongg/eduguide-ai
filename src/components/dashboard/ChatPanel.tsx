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
import { motion, AnimatePresence } from "framer-motion"

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
        <div className="w-96 border-l border-slate-200 bg-white h-[calc(100vh-60px)] flex flex-col shadow-xl shadow-slate-200/50 z-20">
            {/* Header: The Persona */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                            <GraduationCap className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    </div>
                    <div>
                        <h2 className="font-serif font-bold text-slate-800 leading-none">EduMate AI</h2>
                        <span className="text-xs text-slate-500 font-medium">Teaching Assistant</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-6" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={cn(
                            "flex gap-3 max-w-[90%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        {msg.role === 'assistant' && (
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                <Sparkles className="h-4 w-4 text-indigo-600" />
                            </div>
                        )}

                        <div className={cn(
                            "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-indigo-600 text-white rounded-tr-sm"
                                : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                            <Sparkles className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-100">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Proactive Suggestions (Context Aware) */}
            <div className="px-4 py-2 bg-slate-50/50">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider pl-1">Suggested Actions</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSendMessage(s.prompt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-full text-xs font-medium text-indigo-700 transition-colors whitespace-nowrap shadow-sm"
                        >
                            <s.icon className="h-3 w-3" />
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <form
                    className="relative flex items-center"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Ask about "${currentContext}"...`}
                        className="pr-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                    />
                    <Button
                        size="icon"
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-1 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
