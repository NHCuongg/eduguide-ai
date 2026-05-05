'use client'

import { useWizardStore } from "@/lib/store"
import type { OnboardingData } from "@/lib/schemas"
import { Briefcase, GraduationCap, Laptop, Compass, TrendingUp } from "lucide-react"
import { ChoiceCard, StepBody, StepFooter, StepHeading, StepLabel } from "./_StepShell"

export default function StepGoals() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const goals: Array<{
        id: OnboardingData["primaryGoal"]
        Icon: typeof Briefcase
        label: string
        desc: string
    }> = [
        { id: "Career Change", Icon: Briefcase, label: "Career change", desc: "Switching into a new field" },
        { id: "Skill Improvement", Icon: TrendingUp, label: "Level up", desc: "Sharpen what I already do" },
        { id: "Academic", Icon: GraduationCap, label: "Academic", desc: "School, university, exams" },
        { id: "Hobby", Icon: Compass, label: "Hobby", desc: "Just for me" },
        { id: "Other", Icon: Laptop, label: "Other", desc: "Something else" },
    ]

    return (
        <StepBody>
            <StepHeading
                eyebrow="Goal"
                title="What's your main motivation?"
                subtitle="Optional — helps us pick pace and depth, but not required."
            />

            <div>
                <StepLabel>Primary goal (optional)</StepLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup">
                    {goals.map(({ id, Icon, label, desc }) => (
                        <ChoiceCard
                            key={id}
                            label={label}
                            description={desc}
                            icon={<Icon className="w-4 h-4" />}
                            selected={data.primaryGoal === id}
                            onSelect={() => setData({ primaryGoal: id })}
                        />
                    ))}
                </div>
            </div>

            <StepFooter onBack={prevStep} onNext={nextStep} />
        </StepBody>
    )
}
