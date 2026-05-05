'use client'

import { useWizardStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { ChoiceCard, StepBody, StepFooter, StepHeading, StepLabel } from "./_StepShell"

export default function Step1() {
    const { data, setData, nextStep } = useWizardStore()

    const levels: Array<{ id: "Beginner" | "Intermediate" | "Advanced"; desc: string }> = [
        { id: "Beginner", desc: "I'm new to this" },
        { id: "Intermediate", desc: "I know the basics" },
        { id: "Advanced", desc: "I want to master it" },
    ]

    // Subject is the only hard requirement; level defaults to Beginner if skipped.
    const canContinue = Boolean(data.targetSkill && data.targetSkill.trim().length >= 2)

    return (
        <StepBody>
            <StepHeading
                eyebrow="Subject"
                title="What do you want to learn?"
                subtitle="One line. We'll shape the rest of the plan around it."
            />

            <div>
                <StepLabel>Target subject</StepLabel>
                <Input
                    placeholder="e.g. Molecular Biology, Calculus II, Spanish A2…"
                    value={data.targetSkill || ""}
                    onChange={(e) => setData({ targetSkill: e.target.value })}
                    autoFocus
                    className="h-12 text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
                />
            </div>

            <div>
                <StepLabel>Current proficiency (optional)</StepLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup">
                    {levels.map((lvl) => (
                        <ChoiceCard
                            key={lvl.id}
                            label={lvl.id}
                            description={lvl.desc}
                            selected={data.currentLevel === lvl.id}
                            onSelect={() => setData({ currentLevel: lvl.id })}
                            layout="tile"
                        />
                    ))}
                </div>
            </div>

            <StepFooter
                showBack={false}
                onNext={nextStep}
                nextDisabled={!canContinue}
            />
        </StepBody>
    )
}
