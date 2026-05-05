"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

// Editorial button system. No gradients, no scale-up hover, no glow. Variants
// stay close to native semantics so call sites read clearly:
//   default — primary action (filled)
//   outline — secondary action (border, transparent)
//   ghost   — tertiary / icon-buttons in toolbars
//   destructive — destructive confirmations
//   secondary — muted filled (e.g. inactive tabs)
//   link    — inline navigation
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700",
                outline:
                    "border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
                secondary:
                    "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
                ghost:
                    "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                link:
                    "text-slate-900 dark:text-slate-100 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-6",
                icon: "h-9 w-9",
                xl: "h-11 px-6 text-base",
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

const MotionButton = motion(Button)

export { Button, buttonVariants, MotionButton }
