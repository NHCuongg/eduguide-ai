import Wizard from "@/components/onboarding/Wizard"

export default function OnboardingPage() {
    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

            {}
            <div className="z-10 w-full max-w-4xl relative">
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 blur-sm pointer-events-none" />
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 font-serif font-black text-2xl mb-2">
                        <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-tr from-indigo-400 to-purple-400">❖</span>
                        <span className="text-white">EduGuide AI</span>
                    </div>
                </div>

                <Wizard />
            </div>
        </main>
    )
}
