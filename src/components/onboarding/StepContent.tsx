'use client'

import { useWizardStore } from "@/lib/store"
import type { OnboardingData } from "@/lib/schemas"
import { FileText, MousePointerClick, Layers } from "lucide-react"
import { ChoiceCard, StepBody, StepFooter, StepHeading, StepLabel } from "./_StepShell"

export default function StepContent() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const options: Array<{
        id: OnboardingData["contentPreference"]
        Icon: typeof FileText
        label: string
        desc: string
    }> = [
        { id: "Text", Icon: FileText, label: "Text", desc: "Read theory at my own pace" },
        { id: "Interactive", Icon: MousePointerClick, label: "Interactive", desc: "Quizzes, exercises, projects" },
        { id: "Mixed", Icon: Layers, label: "Mixed", desc: "A bit of both" },
    ]

    return (
        <StepBody>
            <StepHeading
                eyebrow="Format"
                title="How do you like content delivered?"
                subtitle="Optional — we'll mix things up regardless to keep it fresh."
            />

            <div>
                <StepLabel>Content preference (optional)</StepLabel>
                <div className="space-y-3" role="radiogroup">
                    {options.map(({ id, Icon, label, desc }) => (
                        <ChoiceCard
                            key={id}
                            label={label}
                            description={desc}
                            icon={<Icon className="w-4 h-4" />}
                            selected={data.contentPreference === id}
                            onSelect={() => setData({ contentPreference: id })}
                        />
                    ))}
                </div>
            </div>

            <StepFooter onBack={prevStep} onNext={nextStep} />
        </StepBody>
    )
}
