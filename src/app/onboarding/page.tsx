import Wizard from "@/components/onboarding/Wizard"

export default function OnboardingPage() {
    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Content Container */}
            <div className="z-10 w-full max-w-4xl">
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
