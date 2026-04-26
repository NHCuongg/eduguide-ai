'use client'

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Globe, Loader2 } from "lucide-react"
import { setUserLocale } from "@/i18n/locale-actions"
import type { Locale } from "@/i18n/locale"
import { cn } from "@/lib/utils"

const LOCALES: Locale[] = ["vi", "en"]

export function LanguageSwitcher() {
    const router = useRouter()
    const locale = useLocale() as Locale
    const t = useTranslations("language")
    const [isPending, startTransition] = useTransition()

    const switchTo = (next: Locale) => {
        if (next === locale) return
        startTransition(async () => {
            await setUserLocale(next)
            router.refresh()
        })
    }

    return (
        <div className="px-3 py-2 rounded-lg flex items-center justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                {t("label")}
            </span>
            <div className="inline-flex p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {LOCALES.map((code) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => switchTo(code)}
                        disabled={isPending}
                        className={cn(
                            "h-6 px-2 rounded text-[11px] font-semibold uppercase transition-colors",
                            code === locale
                                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        {code}
                    </button>
                ))}
            </div>
        </div>
    )
}
