'use client'

import { Button } from "@/components/ui/button"
import { Construction, Sparkles } from "lucide-react"

export default function TestPracticePage() {
    return (
        <div className="flex-1 bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-12 rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100 max-w-lg w-full">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Construction className="h-10 w-10 text-indigo-500" />
                    <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-slate-900 mb-3">Test Practice</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Our AI is currently curating a specialized question bank tailored to your learning style. This feature will be available in the next release!
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 transition-all">
                    Notify Me When Ready
                </Button>
            </div>
        </div>
    )
}
