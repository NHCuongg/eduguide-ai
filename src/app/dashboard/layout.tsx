import WorkspaceSidebar from "@/components/dashboard/WorkspaceSidebar"
import RightWidgets from "@/components/dashboard/RightWidgets"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { auth } from "@/auth"
import { getActiveRoadmap } from "@/lib/db/roadmaps"
import { DashboardHydrator } from "@/components/dashboard/DashboardHydrator"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    const userId = session?.user?.id ?? null
    const activeRoadmap = userId ? await getActiveRoadmap(userId) : null

    return (
        <main className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors duration-500">
            <DashboardHydrator activeRoadmap={activeRoadmap} />
            {}
            <header className="h-[60px] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur px-4 md:px-6 flex items-center justify-between z-20 relative">
                <div className="flex items-center gap-3">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-slate-500 dark:text-slate-400">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[260px] border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            <WorkspaceSidebar />
                        </SheetContent>
                    </Sheet>

                    <div className="font-serif font-semibold text-base text-slate-900 dark:text-white tracking-tight">
                        EduGuide AI
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {}
                <div className="hidden md:block">
                    <WorkspaceSidebar />
                </div>

                {children}

                {}
                <div className="hidden lg:block h-full">
                    <RightWidgets />
                </div>
            </div>
        </main>
    )
}
