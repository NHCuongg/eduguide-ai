import { motion } from 'framer-motion'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
}

export default function HeroParticles() {
    const particles: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: ((i * 37) % 100) + 0.5,
        y: ((i * 53) % 100) + 0.5,
        size: 2 + (i % 5),
        duration: 10 + (i % 8),
        delay: (i % 6) * 0.4,
    }))

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
