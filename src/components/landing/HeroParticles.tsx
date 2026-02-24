'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
}

export default function HeroParticles() {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // Generate random particles only on client-side to prevent hydration mismatch
        const generatedParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: Math.random() * 100, // percentage
            size: Math.random() * 4 + 2, // 2px to 6px
            duration: Math.random() * 10 + 10, // 10s to 20s
            delay: Math.random() * 5, // 0s to 5s
        }))
        setParticles(generatedParticles)
    }, [])

    if (particles.length === 0) return null

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-indigo-500/20 dark:bg-indigo-400/20 mix-blend-screen"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    )
}
