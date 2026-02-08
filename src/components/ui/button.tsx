"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 hover:scale-105 active:scale-100",
                destructive:
                    "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-rose-700 hover:scale-105 active:scale-100",
                outline:
                    "border-2 border-slate-200 dark:border-slate-700 bg-background shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-105 active:scale-100",
                secondary:
                    "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-100",
                ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-100",
                link: "text-primary underline-offset-4 hover:underline",
                glow: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] border border-primary/20 hover:scale-105 active:scale-100",
                glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30 hover:scale-105 active:scale-100",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
                xl: "h-12 rounded-xl px-8 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        // Use motion.button if it's not a Slot, otherwise regular
        // Note: complex typing with Slot + Motion is tricky, keeping it simple for now
        // Just adding a hover scale via CSS or simple motion wrapper could be better

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

// Create a MotionButton for specific animated uses
const MotionButton = motion(Button)

export { Button, buttonVariants, MotionButton }
