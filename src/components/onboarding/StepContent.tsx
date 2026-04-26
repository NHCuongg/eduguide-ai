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
        { id: "Text", Icon: FileText, label: "Text", desc: "Đọc lý thuyết theo nhịp riêng" },
        { id: "Interactive", Icon: MousePointerClick, label: "Interactive", desc: "Quiz, bài tập, dự án" },
        { id: "Mixed", Icon: Layers, label: "Mixed", desc: "Cân bằng cả hai" },
    ]

    return (
        <StepBody>
            <StepHeading
                eyebrow="Format"
                title="How do you like content delivered?"
                subtitle="Lựa chọn format ưu tiên — chúng tôi vẫn trộn nhẹ để bạn không chán."
            />

            <div>
                <StepLabel>Content preference</StepLabel>
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

            <StepFooter onBack={prevStep} onNext={nextStep} nextDisabled={!data.contentPreference} />
        </StepBody>
    )
}
