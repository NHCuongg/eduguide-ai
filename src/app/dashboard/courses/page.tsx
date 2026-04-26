import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { getUserRoadmaps } from "@/lib/db/roadmaps"
import { CoursesView } from "@/components/dashboard/courses/CoursesView"

export default async function CoursesPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const courses = await getUserRoadmaps(session.user.id)
    const t = await getTranslations("courses")

    return (
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {t("eyebrow")}
                        </p>
                        <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {t("title")}
                        </h1>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                            {t("subtitle")}
                        </p>
                    </div>
                    <Button
                        asChild
                        className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold h-11 px-5 shadow-sm"
                    >
                        <Link href="/onboarding?fresh=1">
                            <Plus className="w-4 h-4 mr-2" /> {t("newCourse")}
                        </Link>
                    </Button>
                </header>

                <CoursesView courses={courses} />
            </div>
        </div>
    )
}
