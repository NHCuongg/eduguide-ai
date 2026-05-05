'use client'

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

const OPTIONS = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "system", label: "System", Icon: Monitor },
] as const

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    const current = mounted ? theme ?? "system" : "system"

    return (
        <div className="grid grid-cols-3 gap-2">
            {OPTIONS.map(({ value, label, Icon }) => {
                const isActive = current === value
                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        aria-pressed={isActive}
                        className={cn(
                            "flex flex-col items-center gap-2 px-3 py-4 rounded-xl border transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                            isActive
                                ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                        )}
                    >
                        <span
                            className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center",
                                isActive
                                    ? "bg-indigo-500 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
