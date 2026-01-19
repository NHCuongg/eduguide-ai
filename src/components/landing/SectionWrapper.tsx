'use client'

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
    children: ReactNode
    className?: string
    delay?: number
}

export default function SectionWrapper({ children, className, delay = 0 }: SectionWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}
