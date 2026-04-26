import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { getActiveRoadmap } from "@/lib/db/roadmaps"
import { TestPracticeView, type TestModule } from "@/components/dashboard/tests/TestPracticeView"

export default async function TestPracticePage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const active = await getActiveRoadmap(session.user.id)
    const t = await getTranslations("tests")

    return (
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-10">
                <header className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t("eyebrow")}
                    </p>
                    <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                        {t("subtitle")}
                    </p>
                </header>

                {active ? <ActivePractice active={active} /> : <NoRoadmapState />}
            </div>
        </div>
    )
}

function ActivePractice({ active }: { active: NonNullable<Awaited<ReturnType<typeof getActiveRoadmap>>> }) {
    const completedSet = new Set(active.completedModuleIds)
    const modules: TestModule[] = []
    for (let p = 0; p < active.content.phases.length; p++) {
        const phase = active.content.phases[p]
        for (let m = 0; m < phase.modules.length; m++) {
            const id = `${p}-${m}`
            const mod = phase.modules[m]
            modules.push({
                id,
                phaseIndex: p,
                phaseName: phase.name,
                moduleIndex: m,
                title: mod.title,
                description: mod.description,
                estimatedTime: mod.estimatedTime,
                isCompleted: completedSet.has(id),
            })
        }
    }

    if (modules.length === 0) {
        return (
            <section className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    Khóa active chưa có mô-đun
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Tạo lại lộ trình hoặc chọn một khóa khác để bắt đầu luyện tập.
                </p>
            </section>
        )
    }

    return <TestPracticeView courseTitle={active.title} modules={modules} />
}

function NoRoadmapState() {
    return (
        <section className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mb-5">
                <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Chưa có khóa học nào để luyện tập
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                Tạo lộ trình AI trước để mở khóa các bộ quiz luyện tập theo từng mô-đun.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
                <Button asChild className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold h-11 px-5">
                    <Link href="/onboarding?fresh=1">
                        <Plus className="w-4 h-4 mr-2" /> Tạo lộ trình mới
                    </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl h-11 px-5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold">
                    <Link href="/dashboard/courses">Xem khóa hiện có</Link>
                </Button>
            </div>
        </section>
    )
}
