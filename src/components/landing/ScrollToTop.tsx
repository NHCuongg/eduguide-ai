'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 50) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed bottom-8 right-8 z-[100] group"
                >
                    <motion.button
                        onClick={scrollToTop}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-[0_10px_40px_-5px_rgba(79,70,229,0.5)] focus:outline-none transition-all duration-300"
                        title="Scroll to top"
                    >
                        {/* Glow layer */}
                        <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300" />

                        {/* Hover brightener */}
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                        <ArrowUp className="w-6 h-6 stroke-[2.5]" />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
