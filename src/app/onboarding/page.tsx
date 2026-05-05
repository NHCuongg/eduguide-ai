import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getUserRoadmaps } from "@/lib/db/roadmaps"
import Wizard from "@/components/onboarding/Wizard"
import WizardResetGuard from "@/components/onboarding/WizardResetGuard"

interface OnboardingPageProps {
    searchParams: Promise<{ fresh?: string }>
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
    const params = await searchParams
    const isFresh = params.fresh === "1"

    // Only force-onboarding when user has no roadmap yet, or when they
    // explicitly opted-in via ?fresh=1 (e.g. "+ New course" button).
    if (!isFresh) {
        const session = await auth()
        if (session?.user?.id) {
            const roadmaps = await getUserRoadmaps(session.user.id)
            if (roadmaps.length > 0) {
                redirect("/dashboard")
            }
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Suspense fallback={null}>
                <WizardResetGuard />
            </Suspense>

            <header className="px-6 md:px-10 py-6 flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-white">
                    <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 to-violet-500">❖</span>
                    <span className="font-serif font-semibold text-base tracking-tight">EduGuide AI</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-wider"
                >
                    Skip for now
                </Link>
            </header>

            <div className="flex-1 flex items-start justify-center px-6 md:px-10 pb-16">
                <div className="w-full max-w-2xl">
                    <Wizard />
                </div>
            </div>
        </main>
    )
}
