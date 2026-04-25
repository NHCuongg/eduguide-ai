'use client'

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import { showToast } from "@/lib/toast"
import Link from "next/link"
import { resetPassword } from "@/app/actions/auth"

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>}>
            <ResetPasswordScreen />
        </Suspense>
    )
}

function ResetPasswordScreen() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isPending, setIsPending] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!token) {
            showToast.error("Error", "No valid reset token provided.")
            setErrorMessage("This reset link is invalid or has expired.")
            return
        }

        setIsPending(true)
        setErrorMessage("")

        try {
            const formData = new FormData(e.currentTarget)
            const password = formData.get('password') as string
            const confirmPassword = formData.get('confirmPassword') as string

            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.")
                setIsPending(false)
                return
            }

            formData.append('token', token)

            const result = await resetPassword(formData)
            if (result?.error) {
                setErrorMessage(result.error)
                showToast.error("Failed", result.error)
            } else if (result?.success) {
                showToast.success("Success!", "Your password has been updated.")
                setTimeout(() => router.push('/login'), 2000)
            }
        } catch (error) {
            console.error("Reset password error:", error)
            setErrorMessage("Something went wrong. Please try again.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
            <Link href="/login" className="absolute top-8 left-8 z-50">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign in
                </Button>
            </Link>

            <div className="w-full max-w-[400px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800"
                >
                    <div className="flex flex-col space-y-3 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 mx-auto mb-2">
                            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-serif font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                            Create a new password
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium pb-2">
                            Please enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="dark:text-slate-200 font-semibold text-slate-700" htmlFor="password">New password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    disabled={isPending || !token}
                                    required
                                    minLength={6}
                                    className="h-12 border-2 rounded-xl focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="dark:text-slate-200 font-semibold text-slate-700" htmlFor="confirmPassword">Confirm password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    disabled={isPending || !token}
                                    required
                                    minLength={6}
                                    className="h-12 border-2 rounded-xl focus:border-indigo-500"
                                />
                            </div>
                            <Button
                                disabled={isPending || !token}
                                type="submit"
                                className="h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-lg mt-2 rounded-xl"
                            >
                                {isPending ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <span>Save new password</span>
                                )}
                            </Button>
                        </div>

                        <div className="flex min-h-8 items-start mt-4 text-sm text-red-500 font-medium" aria-live="polite">
                            <AnimatePresence>
                                {!token && !errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 text-amber-600 w-full"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>No token found. Please click the reset link in your email.</span>
                                    </motion.div>
                                )}
                                {errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 w-full"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
