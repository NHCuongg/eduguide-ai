'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import SectionWrapper from "./SectionWrapper"
import { useSession } from "next-auth/react"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
    const { status } = useSession()
    const ctaHref = status === "authenticated" ? "/dashboard" : "/onboarding"
    const ctaLabel = status === "authenticated" ? "Open my Workspace" : "Try EduGuide Free"

    return (
        <section className="py-24 md:py-32 bg-slate-50 dark:bg-zinc-950">
            <div className="container mx-auto px-6">
                <SectionWrapper>
                    <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 dark:bg-white p-10 md:p-16 text-center">
                        <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-white dark:text-slate-900 mb-4">
                            Study smarter, not harder.
                        </h2>
                        <p className="text-slate-300 dark:text-slate-600 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                            Join self-directed learners building their own accredited-style education with EduGuide AI.
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="rounded-xl h-12 px-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                        >
                            <Link href={ctaHref}>
                                {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </SectionWrapper>
            </div>
        </section>
    )
}
