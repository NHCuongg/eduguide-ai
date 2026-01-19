'use client'

import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import SectionWrapper from "./SectionWrapper"
import { motion } from "framer-motion"
import { useState } from "react"

const tiers = [
    {
        name: "Free",
        price: "$0",
        description: "Essential tools for individual teachers",
        features: ["5 AI Lesson Plans/mo", "Basic Curriculum Mapping", "Standard PDF Exports", "Community Support"],
        cta: "Join for Free",
        highlight: false
    },
    {
        name: "Pro",
        price: "$29",
        description: "Advanced AI for power users & departments",
        features: ["Unlimited AI Generations", "Advanced Analytics", "Priority Support", "Custom Branding", "Collaboration Tools"],
        cta: "Get Pro",
        highlight: true
    },
    {
        name: "Schools",
        price: "Custom",
        description: "Enterprise-grade control for districts",
        features: ["SSO & Security", "District-wide Reporting", "LMS Integration", "Dedicated Success Manager"],
        cta: "Contact Sales",
        highlight: false
    }
]

export default function PricingSection() {
    const [annual, setAnnual] = useState(true)

    return (
        <section id="pricing" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none opacity-50">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionWrapper className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Simple, Transparent Pricing.</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                        Choose the plan that fits your classroom needs. Cancel anytime.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-sm font-bold", annual ? "text-slate-400 dark:text-slate-600" : "text-slate-900 dark:text-white")}>Monthly</span>
                        <button onClick={() => setAnnual(!annual)} className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded-full p-1 relative transition-colors">
                            <motion.div
                                animate={{ x: annual ? 32 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-6 h-6 bg-white rounded-full shadow-sm"
                            />
                        </button>
                        <span className={cn("text-sm font-bold", annual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600")}>
                            Yearly <span className="text-indigo-600 dark:text-indigo-400 text-xs ml-1 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">-20%</span>
                        </span>
                    </div>
                </SectionWrapper>

                <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                    {tiers.map((tier, i) => (
                        <SectionWrapper key={i} delay={i * 0.1} className={cn("relative", tier.highlight ? "z-10 md:-mt-8 md:-mb-8" : "")}>
                            <div className={cn(
                                "p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl flex flex-col h-full",
                                tier.highlight
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl border-2 border-indigo-600 dark:border-indigo-500 scale-105 shadow-indigo-200 dark:shadow-none"
                                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm"
                            )}>
                                {tier.highlight && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-white" /> Popular Choice
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className={cn("text-xl font-bold mb-2", "text-slate-900 dark:text-white")}>{tier.name}</h3>
                                    <p className={cn("text-sm", "text-slate-500 dark:text-slate-400")}>{tier.description}</p>
                                    <div className="mt-6 flex items-baseline gap-1">
                                        <span className={cn("text-4xl font-black font-serif", "text-slate-900 dark:text-white")}>
                                            {tier.name === "Pro" && annual ? "$24" : tier.price}
                                        </span>
                                        {tier.price !== "Custom" && <span className={cn("text-sm", "text-slate-500 dark:text-slate-500")}>/mo</span>}
                                    </div>
                                    {tier.name === "Pro" && annual && (
                                        <div className="text-xs text-green-600 font-bold mt-1">
                                            Billed $288 yearly (Save $60)
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm">
                                            <div className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0", tier.highlight ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400")}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/onboarding" className="w-full">
                                    <Button
                                        className={cn(
                                            "w-full h-14 text-base font-bold shadow-md rounded-xl transition-all duration-300",
                                            tier.highlight
                                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-105"
                                                : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                                        )}
                                    >
                                        {tier.cta}
                                    </Button>
                                </Link>
                            </div>
                        </SectionWrapper>
                    ))}
                </div>
            </div>
        </section >
    )
}
