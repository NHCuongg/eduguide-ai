'use client'

import Image from "next/image"
import { authenticate } from "@/lib/actions"
import { registerUser, sendResetPasswordEmail } from "@/app/actions/auth"
import { useActionState, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { showToast } from "@/lib/toast"

const TESTIMONIALS = [
    {
        quote: "I stopped buying courses. I plan a topic on Sunday and I'm three modules deep by Thursday.",
        initials: "LM",
        author: "Linh M.",
        role: "Self-taught designer",
    },
    {
        quote: "The roadmap actually fits my schedule. I told it I had 6 hours a week and it didn't pretend otherwise.",
        initials: "TN",
        author: "Tuan N.",
        role: "Backend engineer",
    },
    {
        quote: "Quizzes are short. Flashcards repeat what I missed. I keep coming back, which is the part I always failed before.",
        initials: "AK",
        author: "Anh K.",
        role: "Master's student",
    },
]

const FEATURES = [
    {
        quote: "Pick a topic. Get a path. Stick with it.",
        bullets: [
            "A roadmap shaped by your goal and weekly hours",
            "Reading, quizzes and flashcards generated per module",
            "Progress saved across devices",
        ],
    },
    {
        quote: "Built for the days you don't feel like studying.",
        bullets: [
            "10-minute review decks",
            "Short quizzes with one clear next step",
            "Streaks without the guilt-trip",
        ],
    },
]

export default function AuthScreen({ initialMode }: { initialMode: 'login' | 'register' | 'forgot-password' }) {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode)

    const [loginErrorMessage, loginDispatch, isLoginPending] = useActionState(async (prevState: string | undefined, formData: FormData) => {
        const err = await authenticate(prevState, formData);
        if (err) {
            showToast.error("Đăng nhập thất bại", err);
        } else {
            showToast.success("Đăng nhập thành công!", "Vào Workspace...");
        }
        return err;
    }, undefined)

    const [isRegisterPending, setIsRegisterPending] = useState(false)
    const [registerErrorMessage, setRegisterErrorMessage] = useState("")

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsRegisterPending(true)
        setRegisterErrorMessage("")

        try {
            const formData = new FormData(e.currentTarget)
            const result = await registerUser(formData)
            if (result?.error) {
                setRegisterErrorMessage(result.error)
                showToast.error("Đăng ký không thành công", result.error)
            } else if (result?.success) {
                showToast.success("Tạo tài khoản thành công!", "Đang chuyển hướng...")
            }
        } catch (error) {
            // Server Actions throw NEXT_REDIRECT to trigger navigation. Re-throw it
            // so Next.js handles the redirect; otherwise the client treats success
            // as a generic failure and shows a misleading error toast.
            if (
                error &&
                typeof error === "object" &&
                "message" in error &&
                (error as Error).message === "NEXT_REDIRECT"
            ) {
                throw error
            }
            const fallback = "Đã có lỗi xảy ra. Vui lòng thử lại."
            setRegisterErrorMessage(fallback)
            showToast.error("Đăng ký không thành công", fallback)
        } finally {
            setIsRegisterPending(false)
        }
    }

    const [isForgotPasswordPending, setIsForgotPasswordPending] = useState(false)
    const [forgotPasswordErrorMessage, setForgotPasswordErrorMessage] = useState("")

    const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsForgotPasswordPending(true)
        setForgotPasswordErrorMessage("")

        try {
            const formData = new FormData(e.currentTarget)
            const result = await sendResetPasswordEmail(formData)
            if (result?.error) {
                setForgotPasswordErrorMessage(result.error)
                showToast.error("Gửi yêu cầu thất bại", result.error)
            } else if (result?.success) {
                showToast.success(
                    "Đã xử lý yêu cầu",
                    "Nếu email tồn tại trong hệ thống, liên kết khôi phục sẽ được gửi đến hộp thư của bạn."
                )
                setTimeout(() => switchMode('login'), 2500)
            }
        } catch {
            const fallback = "Đã có lỗi xảy ra. Vui lòng thử lại."
            setForgotPasswordErrorMessage(fallback)
            showToast.error("Gửi yêu cầu thất bại", fallback)
        } finally {
            setIsForgotPasswordPending(false)
        }
    }

    const switchMode = (newMode: 'login' | 'register' | 'forgot-password') => {
        setMode(newMode)
        
        window.history.pushState(null, '', `/${newMode}`)
    }

    const contentVariants = {
        login: { opacity: 1, x: 0 },
        register: { opacity: 1, x: 0 },
        exitRight: { opacity: 0, x: 20 },
        exitLeft: { opacity: 0, x: -20 },
        enterRight: { opacity: 0, x: 20 },
        enterLeft: { opacity: 0, x: -20 },
    }

    const isPending = isLoginPending || isRegisterPending || isForgotPasswordPending

    // Pick a single testimonial/feature deterministically per render so it doesn't rotate.
    const staticTestimonial = TESTIMONIALS[0]
    const staticFeature = FEATURES[0]

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950">
            {/* Left side panel — image background, dark overlay for legibility */}
            <div className="hidden lg:flex relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=70"
                    alt=""
                    fill
                    sizes="50vw"
                    priority
                    className="object-cover opacity-40"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-slate-900/70"
                />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 font-semibold text-lg tracking-tight">
                        <span className="text-xl text-indigo-400">❖</span>
                        EduGuide AI
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    {mode === 'login' ? (
                        <>
                            <p className="text-xl lg:text-2xl font-medium leading-snug tracking-tight text-slate-100">
                                &ldquo;{staticTestimonial.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold">
                                    {staticTestimonial.initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{staticTestimonial.author}</div>
                                    <div className="text-xs text-slate-400">{staticTestimonial.role}</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-xl lg:text-2xl font-medium leading-snug tracking-tight text-slate-100">
                                &ldquo;{staticFeature.quote}&rdquo;
                            </p>
                            <ul className="space-y-2 pt-2 text-sm text-slate-300 border-t border-slate-800 pt-4">
                                {staticFeature.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-indigo-400 mt-0.5">✓</span> {bullet}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <div className="relative z-10 flex gap-5 text-xs text-slate-500">
                    <span>© 2026 EduGuide Inc.</span>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </div>

            {}
            <div className="relative flex items-center justify-center p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
                <Link href="/" className="absolute top-8 left-8 lg:hidden mt-2 ml-2 z-50">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </Link>

                <div className="absolute top-8 right-8 lg:top-8 lg:right-12 z-50">
                    <AnimatePresence mode="wait">
                        {mode === 'login' ? (
                            <motion.div key="btn-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Button
                                    variant="ghost"
                                    onClick={() => switchMode('register')}
                                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                                >
                                    Don&apos;t have an account? Sign up
                                </Button>
                            </motion.div>
                        ) : mode === 'register' ? (
                            <motion.div key="btn-register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Button
                                    variant="ghost"
                                    onClick={() => switchMode('login')}
                                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                                >
                                    Already have an account? Sign In
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div key="btn-forgot-password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Button
                                    variant="ghost"
                                    onClick={() => switchMode('login')}
                                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                                >
                                    Back to Sign In
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full max-w-[400px]">
                    <AnimatePresence mode="wait" initial={false}>
                        {mode === 'login' ? (
                            <motion.div
                                key="form-login"
                                initial="enterLeft"
                                animate="login"
                                exit="exitLeft"
                                variants={contentVariants}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col space-y-2 text-left">
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sign in</p>
                                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        Welcome back
                                    </h1>
                                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                                        Enter your email to sign in to your workspace
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    <form action={loginDispatch}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-3">
                                                <div className="grid gap-2">
                                                    <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="email-login">Email</Label>
                                                    <Input
                                                        id="email-login"
                                                        name="email"
                                                        placeholder="name@example.com"
                                                        type="email"
                                                        autoCapitalize="none"
                                                        autoComplete="email"
                                                        autoCorrect="off"
                                                        disabled={isPending}
                                                        className="h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-slate-900 dark:focus:border-white"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="password-login">Password</Label>
                                                        <button type="button" onClick={() => switchMode('forgot-password')} className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors">Forgot password?</button>
                                                    </div>
                                                    <Input
                                                        id="password-login"
                                                        name="password"
                                                        type="password"
                                                        autoCapitalize="none"
                                                        autoCorrect="off"
                                                        disabled={isPending}
                                                        className="h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-slate-900 dark:focus:border-white"
                                                    />
                                                </div>
                                                <Button
                                                    disabled={isPending}
                                                    className="h-11 mt-2"
                                                >
                                                    {isLoginPending ? (
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <span>Sign in</span>
                                                    )}
                                                </Button>
                                            </div>
                                            <div className="flex min-h-8 items-start my-2 text-sm text-red-500 font-medium" aria-live="polite">
                                                <AnimatePresence>
                                                    {loginErrorMessage && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/50 w-full"
                                                        >
                                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                            <span>{loginErrorMessage}</span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        ) : mode === 'register' ? (
                            <motion.div
                                key="form-register"
                                initial="enterRight"
                                animate="register"
                                exit="exitRight"
                                variants={contentVariants}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col space-y-2 text-left">
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sign up</p>
                                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        Create your account
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        It takes a minute. You can change anything later.
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    <form onSubmit={handleRegisterSubmit}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="name-register">Full Name</Label>
                                                    <Input
                                                        id="name-register"
                                                        name="name"
                                                        placeholder="John Doe"
                                                        type="text"
                                                        autoComplete="name"
                                                        disabled={isPending}
                                                        required
                                                        className="h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-slate-900 dark:focus:border-white"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="email-register">Email</Label>
                                                    <Input
                                                        id="email-register"
                                                        name="email"
                                                        placeholder="name@example.com"
                                                        type="email"
                                                        autoCapitalize="none"
                                                        autoComplete="email"
                                                        autoCorrect="off"
                                                        disabled={isPending}
                                                        required
                                                        className="h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-slate-900 dark:focus:border-white"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="password-register">Password</Label>
                                                    <Input
                                                        id="password-register"
                                                        name="password"
                                                        type="password"
                                                        autoComplete="new-password"
                                                        disabled={isPending}
                                                        required
                                                        minLength={8}
                                                        pattern="(?=.*[A-Za-z])(?=.*[\d\W_]).{8,}"
                                                        title="Tối thiểu 8 ký tự, bao gồm chữ cái và số (hoặc ký tự đặc biệt)"
                                                        className="h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-slate-900 dark:focus:border-white"
                                                    />
                                                </div>
                                                <Button
                                                    disabled={isPending}
                                                    type="submit"
                                                    className="h-11 mt-2"
                                                >
                                                    {isRegisterPending ? (
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-2 w-full">Sign Up <ArrowLeft className="w-5 h-5 rotate-180" /></span>
                                                    )}
                                                </Button>
                                            </div>
                                            <div className="flex min-h-8 items-start my-2 text-sm text-red-500 font-medium" aria-live="polite">
                                                <AnimatePresence>
                                                    {registerErrorMessage && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/50 w-full"
                                                        >
                                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                            <span>{registerErrorMessage}</span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                                    By signing up, you agree to our{" "}
                                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form-forgot-password"
                                initial="enterRight"
                                animate="login"
                                exit="exitRight"
                                variants={contentVariants}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col space-y-2 text-left">
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Recover</p>
                                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        Reset your password
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        We'll email you a link to choose a new one.
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    <form onSubmit={handleForgotPasswordSubmit}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-3">
                                                <div className="grid gap-2">
                                                    <Label className="dark:text-slate-200 font-semibold text-slate-700 dark:text-slate-300" htmlFor="email-forgot">Email</Label>
                                                    <Input
                                                        id="email-forgot"
                                                        name="email"
                                                        placeholder="name@example.com"
                                                        type="email"
                                                        autoCapitalize="none"
                                                        autoComplete="email"
                                                        autoCorrect="off"
                                                        disabled={isPending}
                                                        required
                                                        className="h-11 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-slate-900 dark:focus:border-white"
                                                    />
                                                </div>
                                                <Button
                                                    disabled={isPending}
                                                    type="submit"
                                                    className="h-11 mt-2"
                                                >
                                                    {isForgotPasswordPending ? (
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <span>Send recovery link</span>
                                                    )}
                                                </Button>
                                            </div>
                                            <div className="flex min-h-8 items-start my-2 text-sm text-red-500 font-medium" aria-live="polite">
                                                <AnimatePresence>
                                                    {forgotPasswordErrorMessage && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/50 w-full"
                                                        >
                                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                            <span>{forgotPasswordErrorMessage}</span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
