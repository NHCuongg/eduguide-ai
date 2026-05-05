import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import SectionWrapper from "./SectionWrapper"

const tiers = [
    {
        name: "Free",
        price: "$0",
        description: "Essential tools for individuals",
        features: ["5 roadmaps per month", "Module-level study tools", "PDF exports", "Community support"],
        cta: "Get started",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$29",
        description: "For people who study a lot",
        features: ["Unlimited roadmaps", "Progress analytics", "Priority support", "Custom branding", "Sharing & collaboration"],
        cta: "Get Pro",
        highlight: true,
    },
    {
        name: "Schools",
        price: "Custom",
        description: "Enterprise-grade for districts",
        features: ["SSO & security", "District-wide reporting", "LMS integration", "Dedicated success manager"],
        cta: "Contact sales",
        highlight: false,
    },
]

export default function PricingSection() {
    return (
        <section id="pricing" className="py-20 md:py-28 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-6">
                <SectionWrapper className="text-center mb-14 max-w-2xl mx-auto">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                        Pricing
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        Choose the plan that fits your needs. Cancel anytime.
                    </p>
                </SectionWrapper>

                <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {tiers.map((tier, i) => (
                        <SectionWrapper key={i} delay={i * 0.07} className="h-full">
                            <div
                                className={cn(
                                    "relative h-full p-6 md:p-7 rounded-2xl border flex flex-col",
                                    tier.highlight
                                        ? "border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                        : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                )}
                            >
                                {tier.highlight ? (
                                    <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                        Popular
                                    </span>
                                ) : null}
                                <div className="mb-6">
                                    <h3 className={cn("text-base font-semibold tracking-tight mb-1", tier.highlight ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-white")}>
                                        {tier.name}
                                    </h3>
                                    <p className={cn("text-xs", tier.highlight ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400")}>
                                        {tier.description}
                                    </p>
                                    <div className="mt-5 flex items-baseline gap-1">
                                        <span className={cn("text-4xl font-semibold tracking-tight font-serif", tier.highlight ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-white")}>
                                            {tier.price}
                                        </span>
                                        {tier.price !== "Custom" ? (
                                            <span className={cn("text-sm", tier.highlight ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-500")}>
                                                /mo
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-7 flex-1">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className={cn("flex items-start gap-2.5 text-sm", tier.highlight ? "text-slate-100 dark:text-slate-800" : "text-slate-700 dark:text-slate-300")}>
                                            <Check className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", tier.highlight ? "text-indigo-300 dark:text-indigo-600" : "text-indigo-500")} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild
                                    className={cn(
                                        "w-full h-11 rounded-xl font-semibold",
                                        tier.highlight
                                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                                    )}
                                >
                                    <Link href={tier.price === "Custom" ? "mailto:sales@eduguide.ai" : "/onboarding"}>{tier.cta}</Link>
                                </Button>
                            </div>
                        </SectionWrapper>
                    ))}
                </div>
            </div>
        </section>
    )
}
