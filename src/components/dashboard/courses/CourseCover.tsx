
const PALETTES = [
    { from: "from-indigo-500", to: "to-violet-600" },
    { from: "from-emerald-500", to: "to-teal-600" },
    { from: "from-rose-500", to: "to-orange-500" },
    { from: "from-sky-500", to: "to-indigo-600" },
    { from: "from-amber-500", to: "to-rose-500" },
    { from: "from-fuchsia-500", to: "to-purple-600" },
]

function hashString(input: string): number {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i)) >>> 0
    }
    return hash
}

export function CourseCover({ id, title, aspect = "16/9" }: { id: string; title: string; aspect?: string }) {
    const palette = PALETTES[hashString(id) % PALETTES.length]
    const initial = title.trim()[0]?.toUpperCase() ?? "✦"
    return (
        <div
            className={`w-full bg-gradient-to-br ${palette.from} ${palette.to} relative overflow-hidden`}
            style={{ aspectRatio: aspect }}
            aria-hidden
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl md:text-7xl font-serif font-bold text-white/80 drop-shadow-sm">{initial}</span>
            </div>
        </div>
    )
}
