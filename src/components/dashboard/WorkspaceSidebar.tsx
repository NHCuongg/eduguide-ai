'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, GraduationCap, FileText, UserCircle, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useWizardStore } from "@/lib/store"
import { signOut } from "next-auth/react"

const navItems = [
    { icon: LayoutDashboard, label: "Tổng quan", href: "/dashboard", wip: true },
    { icon: BookOpen, label: "Study plan", href: "/dashboard/plan" },
    { icon: GraduationCap, label: "My courses", href: "/dashboard/courses" },
    { icon: FileText, label: "Test Practice", href: "/dashboard/tests", wip: true },
    { icon: UserCircle, label: "Learning Profile", href: "/dashboard/profile", wip: true },
]

export default function WorkspaceSidebar() {

    const pathname = usePathname()

    return (
        <div className="w-[260px] bg-[#0f172a] text-slate-300 flex flex-col h-[calc(100vh-60px)] border-r border-slate-800">
            {/* User Profile Summary - Optional placement or top header */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        JD
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">Dr. James Dalton</div>
                        <div className="text-xs text-slate-400">Science Stream</div>
                    </div>
                </div>

                <div className="space-y-1">
                    {navItems.map((item, i) => {
                        const isActive = item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href)

                        return (
                            <Link key={i} href={item.href} className="block">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 h-12 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-white text-[#0f172a] hover:bg-white/90 shadow-md transform hover:translate-x-1"
                                            : "hover:bg-slate-800 hover:text-white text-slate-400"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-slate-500")} />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-slate-800">
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800">
                    <Settings className="h-5 w-5" />
                    Settings
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2"
                    onClick={async () => {
                        // 1. Clear Local Storage / Session Storage
                        localStorage.clear()
                        sessionStorage.clear()

                        // 2. Reset Zustand Store (if persistent)
                        useWizardStore.getState().reset()

                        // 3. NextAuth Sign Out & Redirect
                        await signOut({ callbackUrl: "/login" })
                    }}
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
