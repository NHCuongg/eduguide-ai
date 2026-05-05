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
        <Suspense
            fallback={
                <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                </div>
            }
        >
            <ResetPasswordScreen />
        </Suspense>
    )
}

function ResetPasswordScreen() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isPending, setIsPending] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!token) {
            setErrorMessage("Liên kết khôi phục không hợp lệ hoặc đã hết hạn.")
            return
        }

        setIsPending(true)
        setErrorMessage("")

        try {
            const formData = new FormData(e.currentTarget)
            const password = formData.get("password") as string
            const confirmPassword = formData.get("confirmPassword") as string

            if (password !== confirmPassword) {
                setErrorMessage("Mật khẩu không khớp.")
                setIsPending(false)
                return
            }

            formData.append("token", token)
            const result = await resetPassword(formData)
            if (result?.error) {
                setErrorMessage(result.error)
                showToast.error("Đặt lại thất bại", result.error)
            } else if (result?.success) {
                showToast.success("Đã đổi mật khẩu", "Đang chuyển sang trang đăng nhập…")
                setTimeout(() => router.push("/login"), 1500)
            }
        } catch {
            setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
            <Link href="/login" className="absolute top-6 left-6">
                <Button variant="ghost" className="gap-2 text-slate-600 dark:text-slate-300">
                    <ArrowLeft className="w-4 h-4" /> Back to sign in
                </Button>
            </Link>

            <div className="w-full max-w-[400px]">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-7 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800"
                >
                    <header className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mx-auto">
                            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Đặt mật khẩu mới
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Nhập mật khẩu mới cho tài khoản của bạn.
                        </p>
                    </header>

                    {!token ? (
                        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 p-3 text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>Không tìm thấy token. Hãy bấm vào liên kết trong email khôi phục.</p>
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                Mật khẩu mới
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                disabled={isPending || !token}
                                required
                                minLength={8}
                                pattern="(?=.*[A-Za-z])(?=.*[\d\W_]).{8,}"
                                title="Tối thiểu 8 ký tự, bao gồm chữ cái và số (hoặc ký tự đặc biệt)"
                                className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                Xác nhận mật khẩu
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                disabled={isPending || !token}
                                required
                                minLength={8}
                                className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending || !token}
                            className="w-full h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu mật khẩu mới"}
                        </Button>

                        <div className="min-h-[2rem]" aria-live="polite">
                            <AnimatePresence>
                                {errorMessage ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400"
                                    >
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
