'use client'

import { useState, useEffect } from "react"
import { motion, useScroll, useMotionValueEvent, useSpring, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X, Sun, Moon, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const { data: session, status } = useSession()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const { scrollY, scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20)
    })

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className={cn(
                    "fixed top-0 inset-x-0 z-50 h-20 transition-all duration-500",
                    scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm" : "bg-transparent"
                )}
            >
                {/* Scroll Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left opacity-80"
                    style={{ scaleX }}
                />

                <div className="container mx-auto px-6 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="font-serif font-black text-xl md:text-2xl text-zinc-900 dark:text-white flex items-center gap-2 group relative z-50">
                        <span className="text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600 to-violet-600 group-hover:scale-110 transition-transform">❖</span>
                        EduGuide AI
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        {["Methodology", "Resources", "Pricing"].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                            </Link>
                        ))}

                        {/* Dark Mode Toggle */}
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400">
                            {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                            {!mounted && <Moon className="w-5 h-5" />}
                        </button>


                        {status === 'authenticated' ? (
                            <Link href="/dashboard">
                                <Button className="rounded-full px-6 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="outline" className="rounded-full px-6 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white transition-all duration-300">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="flex md:hidden items-center gap-4 relative z-50">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300">
                            {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                            {!mounted && <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-900 dark:text-white">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col items-center justify-center"
                    >
                        <ul className="flex flex-col gap-8 text-2xl font-bold text-zinc-900 dark:text-white text-center">
                            {["Methodology", "Resources", "Pricing"].map((item, i) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                >
                                    <Link
                                        href={`#${item.toLowerCase()}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-12 w-full max-w-xs"
                        >
                            {status === 'authenticated' ? (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full h-14 text-lg rounded-xl bg-indigo-600 text-white gap-2 shadow-lg shadow-indigo-500/20">
                                        <LayoutDashboard className="w-5 h-5" />
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full h-14 text-lg rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
