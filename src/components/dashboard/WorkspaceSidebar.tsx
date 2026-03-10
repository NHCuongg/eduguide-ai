'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, GraduationCap, FileText, UserCircle, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useWizardStore } from "@/lib/store"
import { signOut, useSession } from "next-auth/react"

const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard", wip: true },
    { icon: BookOpen, label: "Study Plan", href: "/dashboard/plan" },
    { icon: GraduationCap, label: "My Courses", href: "/dashboard/courses" },
    { icon: FileText, label: "Test Practice", href: "/dashboard/tests", wip: true },
    { icon: UserCircle, label: "Learning Profile", href: "/dashboard/profile", wip: true },
]

export default function WorkspaceSidebar() {

    const pathname = usePathname()
    const { data: session } = useSession()

    const userName = session?.user?.name || 'Learner'
    const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    return (
        <div className="w-[260px] bg-[#0f172a] text-slate-300 flex flex-col h-[calc(100vh-60px)] border-r border-slate-800">
            {}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        {userInitials}
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm truncate max-w-[160px]">{userName}</div>
                        <div className="text-xs text-slate-400">{session?.user?.email || 'Student'}</div>
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
                        
                        localStorage.clear()
                        sessionStorage.clear()

                        useWizardStore.getState().reset()

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
