'use client'

import { authenticate } from "@/lib/actions"
import { registerUser, sendResetPasswordEmail } from "@/app/actions/auth"
import { useActionState, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import HeroParticles from "@/components/landing/HeroParticles"
import { showToast } from "@/lib/toast"

const TESTIMONIALS = [
    {
        quote: "The most sophisticated curriculum design tool I've ever used. It understands academic rigor unlike anything else.",
        initials: "JD",
        author: "Dr. James Dalton",
        role: "Dean of Sciences, Cambridge"
    },
    {
        quote: "I passed my medical boards on the first try thanks to the spaced-repetition algorithms and AI roadmaps.",
        initials: "MR",
        author: "Maximiliano Rossi",
        role: "Medical Student"
    },
    {
        quote: "EduGuide transforms unstructured chaos into a perfectly paved road of knowledge. An absolute game changer.",
        initials: "AK",
        author: "Aisha Khan",
        role: "Self-taught Developer"
    }
]

const FEATURES = [
    {
        quote: "Master complex topics through adaptive guidance and scientifically proven learning methods.",
        bullets: [
            "Personalized curriculum driven by AI",
            "Automated adaptive flashcards",
            "Spaced repetition built-in"
        ]
    },
    {
        quote: "Don't just memorize. Understand deeply with Socratic AI generation that challenges your assumptions.",
        bullets: [
            "Dynamic Socratic quizzes",
            "Feynman technique exercises",
            "Concept-mapping assignments"
        ]
    }
]

export default function AuthScreen({ initialMode }: { initialMode: 'login' | 'register' | 'forgot-password' }) {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode)
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => prev + 1)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const activeTestimonial = TESTIMONIALS[activeIndex % TESTIMONIALS.length]
    const activeFeature = FEATURES[activeIndex % FEATURES.length]

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
            console.error("Registration error:", error)
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
                showToast.success("Đã gửi email khôi phục!", "Vui lòng kiểm tra hộp thư của bạn.")
                setTimeout(() => switchMode('login'), 2000)
            }
        } catch (error) {
            console.error("Forgot password error:", error)
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

    const textVariants = {
        enter: { opacity: 0, y: 10 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    }

    const isPending = isLoginPending || isRegisterPending || isForgotPasswordPending

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950 overflow-hidden">
            {}
            <div className="hidden lg:flex relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 font-serif font-black text-2xl mb-8">
                        <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-tr from-indigo-400 to-purple-400">❖</span>
                        EduGuide AI
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg h-56">
                    <AnimatePresence mode="wait">
                        {mode === 'login' ? (
                            <motion.div
                                key={`login-text-${activeTestimonial.initials}`}
                                variants={textVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                            >
                                <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-6">
                                    &quot;{activeTestimonial.quote}&quot;
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 p-0.5">
                                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold">{activeTestimonial.initials}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{activeTestimonial.author}</div>
                                        <div className="text-slate-400">{activeTestimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`register-text-${activeIndex % FEATURES.length}`}
                                variants={textVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                            >
                                <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-6">
                                    &quot;{activeFeature.quote}&quot;
                                </h2>
                                <div className="flex flex-col gap-2 opacity-80 pt-4 border-t border-slate-700/50 text-sm">
                                    {activeFeature.bullets.map((bullet, i) => (
                                        <p key={i}>✓ {bullet}</p>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative z-10 flex gap-6 text-sm text-slate-400">
                    <span>© 2026 EduGuide Inc.</span>
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </div>

            {}
            <div className="relative flex items-center justify-center p-8 transition-colors duration-500 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
                <div className="absolute inset-0 block opacity-50 pointer-events-none">
                    <HeroParticles />
                </div>

                {}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

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
                                                        className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
                                                        defaultValue="demo@eduguide.ai"
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
                                                        className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
                                                        defaultValue="password123"
                                                    />
                                                </div>
                                                <Button
                                                    disabled={isPending}
                                                    className="h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                                                >
                                                    {isLoginPending ? (
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <span className="flex items-center gap-2">Sign In <Sparkles className="w-5 h-5" /></span>
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
                                <div className="flex flex-col space-y-3 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 mx-auto mb-2">
                                        <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h1 className="text-4xl font-serif font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                                        Create Account
                                    </h1>
                                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                                        Enter your details to generate your first syllabus
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
                                                        className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
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
                                                        className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
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
                                                        minLength={6}
                                                        className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
                                                    />
                                                </div>
                                                <Button
                                                    disabled={isPending}
                                                    type="submit"
                                                    className="h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
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
                                <div className="flex flex-col space-y-3 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 mx-auto mb-2">
                                        <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h1 className="text-4xl font-serif font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                                        Khôi phục mật khẩu
                                    </h1>
                                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                                        Nhập email của bạn để nhận liên kết khôi phục
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
                                                        className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all"
                                                    />
                                                </div>
                                                <Button
                                                    disabled={isPending}
                                                    type="submit"
                                                    className="h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                                                >
                                                    {isForgotPasswordPending ? (
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <span className="flex items-center gap-2">Gửi liên kết khôi phục <Sparkles className="w-5 h-5" /></span>
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
