import Link from "next/link"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { Mail, ShieldCheck, GraduationCap } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { getUserRoadmaps } from "@/lib/db/roadmaps"

function initials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

export default async function LearningProfilePage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const userId = session.user.id
    const userName = session.user.name?.trim() || "Learner"
    const userEmail = session.user.email ?? "—"

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    const roadmaps = await getUserRoadmaps(userId)
    const totalRoadmaps = roadmaps.length
    const totalModules = roadmaps.reduce((sum, r) => sum + r.totalModules, 0)
    const completedModules = roadmaps.reduce((sum, r) => sum + r.completedModules, 0)
    const t = await getTranslations("profile")

    return (
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
                <header>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t("eyebrow")}</p>
                    <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {t("title")}
                    </h1>
                </header>

                <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row gap-6">
                    <div className="h-20 w-20 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xl font-semibold shrink-0">
                        {initials(userName) || "L"}
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">{userName}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {profile?.targetSkill ? `Studying ${profile.targetSkill}` : "Chưa chọn chủ đề học"}
                            </p>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="truncate">{userEmail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Verified account</span>
                            </div>
                            {profile?.currentLevel ? (
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <GraduationCap className="w-4 h-4 text-slate-400" />
                                    <span>Level: {profile.currentLevel}</span>
                                </div>
                            ) : null}
                        </dl>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 grid grid-cols-1 md:grid-cols-3">
                    <Stat label="Courses" value={totalRoadmaps} suffix={totalRoadmaps === 1 ? "roadmap" : "roadmaps"} />
                    <Stat label="Modules" value={totalModules} suffix="created" />
                    <Stat label="Completed" value={completedModules} suffix={`of ${totalModules}`} />
                </section>

                <section>
                    <Button asChild variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-11 px-5 font-semibold">
                        <Link href="/dashboard/courses">Manage courses</Link>
                    </Button>
                </section>
            </div>
        </div>
    )
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
    return (
        <div className="p-5 md:p-6 flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label}
            </p>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {value}
                </span>
                {suffix ? <span className="text-xs text-slate-500 dark:text-slate-400">{suffix}</span> : null}
            </div>
        </div>
    )
}
