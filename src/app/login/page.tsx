'use client'

import { authenticate } from "@/lib/actions"
import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* Left Side: Visual/Brand */}
            <div className="hidden lg:flex relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 font-serif font-black text-2xl mb-8">
                        <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-tr from-indigo-400 to-purple-400">❖</span>
                        EduGuide AI
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="font-serif text-4xl font-bold leading-tight mb-6">
                            &quot;The most sophisticated curriculum design tool I&apos;ve ever used. It understands academic rigor unlike anything else.&quot;
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 p-0.5">
                                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold">JD</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">Dr. James Dalton</div>
                                <div className="text-slate-400">Dean of Sciences, Cambridge</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 flex gap-6 text-sm text-slate-400">
                    <span>© 2026 EduGuide Inc.</span>
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="relative flex items-center justify-center p-8 bg-white dark:bg-slate-950 transition-colors duration-500">
                <Link href="/" className="absolute top-8 left-8 lg:hidden mt-2 ml-2">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </Link>

                <div className="absolute top-8 right-8 lg:top-8 lg:right-12">
                    <Link href="/onboarding">
                        <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                            Don&apos;t have an account? Sign up
                        </Button>
                    </Link>
                </div>

                <div className="w-full max-w-[400px] space-y-8">
                    <div className="flex flex-col space-y-3 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 mx-auto mb-2">
                            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl font-serif font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                            Welcome back
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                            Enter your email to sign in to your workspace
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form action={dispatch}>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <div className="grid gap-2">
                                        <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isPending}
                                            className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
                                            defaultValue="demo@eduguide.ai"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</Label>
                                            <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors">Forgot password?</Link>
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            disabled={isPending}
                                            className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
                                            defaultValue="password123"
                                        />
                                    </div>
                                    <Button
                                        disabled={isPending}
                                        className="h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                                    >
                                        {isPending ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-2">Sign In <Sparkles className="w-5 h-5" /></span>
                                        )}
                                    </Button>
                                </div>
                                <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                                    {errorMessage && (
                                        <>
                                            <p className="text-sm text-red-500">{errorMessage}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </form>


                    </div>

                    <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        By clicking continue, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
