import { redirect } from "next/navigation"
import Link from "next/link"
import { Mail, ShieldCheck, Globe, Palette, KeyRound } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher"
import { SignOutButton } from "@/components/settings/SignOutButton"
import { LanguageSwitcher } from "@/components/dashboard/LanguageSwitcher"

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const t = await getTranslations("settings")

    const userName = session.user.name?.trim() || "Learner"
    const userEmail = session.user.email ?? "—"

    return (
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
                <header>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {t("eyebrow")}
                    </p>
                    <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2">
                        {t("subtitle")}
                    </p>
                </header>

                {/* Account */}
                <Section title={t("account.title")} description={t("account.description")}>
                    <div className="space-y-3 text-sm">
                        <Row icon={<UserBadge initials={initials(userName)} />}>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{userName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t("account.displayName")}</p>
                            </div>
                        </Row>
                        <Row icon={<Mail className="w-4 h-4 text-slate-400" />}>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-white truncate">{userEmail}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t("account.email")}</p>
                            </div>
                        </Row>
                        <Row icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{t("account.verified")}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t("account.verifiedDescription")}</p>
                            </div>
                        </Row>
                    </div>
                </Section>

                {/* Appearance */}
                <Section
                    title={t("appearance.title")}
                    description={t("appearance.description")}
                    icon={<Palette className="w-4 h-4 text-slate-400" />}
                >
                    <ThemeSwitcher />
                </Section>

                {/* Language */}
                <Section
                    title={t("language.title")}
                    description={t("language.description")}
                    icon={<Globe className="w-4 h-4 text-slate-400" />}
                >
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <LanguageSwitcher />
                    </div>
                </Section>

                {/* Security */}
                <Section
                    title={t("security.title")}
                    description={t("security.description")}
                    icon={<KeyRound className="w-4 h-4 text-slate-400" />}
                >
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-11 px-5 font-semibold">
                            <Link href="/reset-password">{t("security.resetPassword")}</Link>
                        </Button>
                        <SignOutButton />
                    </div>
                </Section>

                {/* Quick links */}
                <Section title={t("manage.title")} description={t("manage.description")}>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-11 px-5 font-semibold">
                            <Link href="/dashboard/profile">{t("manage.learningProfile")}</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-11 px-5 font-semibold">
                            <Link href="/dashboard/courses">{t("manage.manageCourses")}</Link>
                        </Button>
                    </div>
                </Section>
            </div>
        </div>
    )
}

function initials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

function UserBadge({ initials }: { initials: string }) {
    return (
        <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs font-semibold">
            {initials || "L"}
        </span>
    )
}

function Section({
    title,
    description,
    icon,
    children,
}: {
    title: string
    description?: string
    icon?: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 space-y-4">
            <div className="flex items-start gap-3">
                {icon ? <span className="mt-0.5">{icon}</span> : null}
                <div className="flex-1">
                    <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
                    {description ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
                    ) : null}
                </div>
            </div>
            {children}
        </section>
    )
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
            <span className="shrink-0">{icon}</span>
            {children}
        </div>
    )
}
