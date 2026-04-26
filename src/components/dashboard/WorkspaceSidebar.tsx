'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, GraduationCap, FileText, UserCircle, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useWizardStore } from "@/lib/store"
import { signOut, useSession } from "next-auth/react"
import { LanguageSwitcher } from "./LanguageSwitcher"

export default function WorkspaceSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const t = useTranslations("nav")

    const navItems = [
        { icon: LayoutDashboard, label: t("overview"), href: "/dashboard" },
        { icon: BookOpen, label: t("studyPlan"), href: "/dashboard/plan" },
        { icon: GraduationCap, label: t("myCourses"), href: "/dashboard/courses" },
        { icon: FileText, label: t("testPractice"), href: "/dashboard/tests" },
        { icon: UserCircle, label: t("profile"), href: "/dashboard/profile" },
    ]

    const userName = session?.user?.name || 'Learner'
    const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    return (
        <div className="w-[260px] bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 flex flex-col h-[calc(100vh-60px)] border-r border-slate-200 dark:border-slate-800">
            <div className="p-5">
                <div className="flex items-center gap-3 mb-8 px-1">
                    <div className="h-9 w-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-semibold text-sm">
                        {userInitials}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{userName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{session?.user?.email || 'Student'}</div>
                    </div>
                </div>

                <nav className="space-y-0.5" aria-label="Workspace navigation">
                    {navItems.map((item) => {
                        const isActive = item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href)

                        return (
                            <Link key={item.href} href={item.href} className="block">
                                <Button
                                    variant="ghost"
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "w-full justify-start gap-3 h-10 text-sm rounded-lg font-medium transition-colors",
                                        isActive
                                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500")} />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-5 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <LanguageSwitcher />
                <Button variant="ghost" className="w-full justify-start gap-3 h-10 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60">
                    <Settings className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    {t("settings")}
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-10 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
                    onClick={async () => {
                        localStorage.clear()
                        sessionStorage.clear()
                        useWizardStore.getState().reset()
                        await signOut({ callbackUrl: "/login" })
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    {t("signOut")}
                </Button>
            </div>
        </div>
    )
}
