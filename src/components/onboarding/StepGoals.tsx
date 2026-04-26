'use client'

import { useWizardStore } from "@/lib/store"
import type { OnboardingData } from "@/lib/schemas"
import { Briefcase, GraduationCap, Laptop, Sparkles, Trophy } from "lucide-react"
import { ChoiceCard, StepBody, StepFooter, StepHeading, StepLabel } from "./_StepShell"

export default function StepGoals() {
    const { data, setData, nextStep, prevStep } = useWizardStore()

    const goals: Array<{
        id: OnboardingData["primaryGoal"]
        Icon: typeof Briefcase
        label: string
        desc: string
    }> = [
        { id: "Career Change", Icon: Briefcase, label: "Career change", desc: "Chuyển sang lĩnh vực mới" },
        { id: "Skill Improvement", Icon: Trophy, label: "Skill up", desc: "Nâng cao kỹ năng hiện tại" },
        { id: "Academic", Icon: GraduationCap, label: "Academic", desc: "Trường lớp / đại học" },
        { id: "Hobby", Icon: Sparkles, label: "Hobby", desc: "Học cho vui" },
        { id: "Other", Icon: Laptop, label: "Other", desc: "Lý do khác" },
    ]

    return (
        <StepBody>
            <StepHeading
                eyebrow="Goal"
                title="What's your main motivation?"
                subtitle="Hiểu động lực giúp chúng tôi điều chỉnh nhịp học và độ sâu."
            />

            <div>
                <StepLabel>Primary goal</StepLabel>
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

            <StepFooter onBack={prevStep} onNext={nextStep} nextDisabled={!data.primaryGoal} />
        </StepBody>
    )
}
