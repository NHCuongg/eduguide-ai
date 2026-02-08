'use client'

import { Button } from "@/components/ui/button"
import { ShieldCheck, Mail } from "lucide-react"

export default function LearningProfilePage() {
    return (
        <div className="flex-1 bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-12 rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100 max-w-lg w-full">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold border-4 border-indigo-50 shadow-lg">
                    JD
                </div>
                <h1 className="font-serif text-3xl font-bold text-slate-900 mb-1">Dr. James Dalton</h1>
                <p className="text-slate-500 font-medium mb-6">Science Stream • Premium Member</p>

                <div className="space-y-3 text-left mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                        james.dalton@example.com
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Verified Account
                    </div>
                </div>

                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl h-12 px-8 font-bold w-full transition-all">
                    Edit Profile Settings
                </Button>
            </div>
        </div>
    )
}
