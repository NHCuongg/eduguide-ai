
import WorkspaceSidebar from "@/components/dashboard/WorkspaceSidebar"
import RightWidgets from "@/components/dashboard/RightWidgets"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors duration-500">
            {/* Global Header */}
            <header className="h-[60px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 flex items-center justify-between shadow-sm z-20 relative">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-slate-500 dark:text-slate-400">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[260px] border-r border-slate-800 bg-[#0f172a] text-slate-300">
                            <WorkspaceSidebar />
                        </SheetContent>
                    </Sheet>

                    <div className="font-serif font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2">
                        EduGuide AI
                        <span className="text-primary text-xs font-sans font-bold bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">Beta</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Placeholder for header actions */}
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-center transition-colors">
                        <span className="sr-only">Notifications</span>
                        <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <WorkspaceSidebar />
                </div>

                {children}

                {/* Right Widgets (Hidden on Mobile/Tablet) */}
                <div className="hidden lg:block h-full">
                    <RightWidgets />
                </div>
            </div>
        </main>
    )
}
