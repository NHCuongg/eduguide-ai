import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8 md:p-16 lg:p-24 selection:bg-indigo-500/30">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/login">
                    <Button variant="ghost" className="gap-2 mb-8 -ml-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Button>
                </Link>

                <div className="space-y-4">
                    <h1 className="text-4xl font-serif font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                        Privacy Policy
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <p className="lead text-lg text-slate-600 dark:text-slate-300">
                        Your privacy is critically important to us. This policy explains how we collect, use, and protect your personal information at EduGuide AI.
                    </p>

                    <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> When you register, we collect your name, email address, and securely hashed passwords.</li>
                            <li><strong>Learning Profile:</strong> We collect the educational data you input, including your current skill levels, academic background, strengths, weaknesses, and target goals.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
                        <p>We use the collected information for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To construct your personalized learning roadmaps via AI.</li>
                            <li>To maintain and improve the intelligence of our spaced-repetition models.</li>
                            <li>To secure your account and communicate important updates.</li>
                        </ul>
                    </section>

                    <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold">3. Data Sharing with Third Parties</h2>
                        <p>
                            We **do not** sell your personal data to advertisers.
                        </p>
                        <p>
                            In order to generate your curriculum, certain anonymized educational prompts (e.g., "Student wants to learn React, currently knows HTML") are sent to our LLM partners (like Google Gemini). We do not send your name or contact information to these AI providers.
                        </p>
                    </section>

                    <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold">4. Data Security</h2>
                        <p>
                            We take reasonable measures to protect your information from unauthorized access or disclosure. Your passwords are hashed using industry-standard bcrypt algorithms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
