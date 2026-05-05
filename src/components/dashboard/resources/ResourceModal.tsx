'use client'

import React, { useCallback, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, FileText, ListChecks, Loader2, ArrowLeft, ChevronRight } from "lucide-react"
import { useGamificationStore } from "@/lib/useGamificationStore"
import { showToast } from "@/lib/toast"
import { submitAsyncJob } from "@/lib/useAsyncJob"
import type { RoadmapResource } from "@/lib/types"
import { cn } from "@/lib/utils"

type ResourceType = "Reading" | "Quiz" | "Flashcard" | "Exercise"

interface Reading {
    title: string
    summary: string
    sections: { heading: string; body: string }[]
    keyTakeaways: string[]
}
interface Flashcards {
    topic: string
    flashcards: { front: string; back: string }[]
}
interface Quiz {
    questions: {
        id: number
        text: string
        options: string[]
        correctAnswer: string
    }[]
}
interface Exercises {
    title: string
    intro: string
    exercises: { prompt: string; hint: string; solution: string }[]
}

type Content = Reading | Flashcards | Quiz | Exercises

interface Props {
    moduleTitle: string
    resources?: RoadmapResource[]
}

const TYPE_META: Record<ResourceType, {
    Icon: typeof BookOpen
    endpoint: string
    label: string
    accent: string
}> = {
    Reading: { Icon: BookOpen, endpoint: "/api/generate-reading", label: "Reading", accent: "text-indigo-600 dark:text-indigo-300" },
    Quiz: { Icon: ListChecks, endpoint: "/api/generate-quiz", label: "Quiz", accent: "text-amber-600 dark:text-amber-300" },
    Flashcard: { Icon: GraduationCap, endpoint: "/api/generate-flashcards", label: "Flashcards", accent: "text-emerald-600 dark:text-emerald-300" },
    Exercise: { Icon: FileText, endpoint: "/api/generate-exercise", label: "Exercise", accent: "text-rose-600 dark:text-rose-300" },
}

function normalizeType(value: string): ResourceType {
    const v = value.trim().toLowerCase()
    if (v === "reading") return "Reading"
    if (v === "quiz") return "Quiz"
    if (v === "flashcard" || v === "flashcards") return "Flashcard"
    if (v === "exercise" || v === "exercises") return "Exercise"
    return "Reading"
}

function buildBody(type: ResourceType, moduleTitle: string, resourceTitle: string) {
    const topic = resourceTitle || moduleTitle
    switch (type) {
        case "Quiz":
            return { topic, skillLevel: "Intermediate" }
        case "Flashcard":
            return { topic, context: moduleTitle }
        default:
            return { topic, moduleTitle, skillLevel: "Intermediate" }
    }
}

export function ResourceModal({ moduleTitle, resources }: Props) {
    const { addXP } = useGamificationStore()
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<{ type: ResourceType; title: string } | null>(null)
    const [content, setContent] = useState<Content | null>(null)
    const [loading, setLoading] = useState(false)

    const aiResources = (resources ?? []).filter((r) => r.title?.trim().length > 0)

    const reset = () => {
        setActive(null)
        setContent(null)
        setLoading(false)
    }

    const fetchContent = useCallback(
        async (type: ResourceType, title: string) => {
            setActive({ type, title })
            setContent(null)
            setLoading(true)
            try {
                const meta = TYPE_META[type]
                const data = await submitAsyncJob<Content>(
                    meta.endpoint,
                    buildBody(type, moduleTitle, title)
                )
                setContent(data)
                addXP(8)
            } catch (error) {
                const message = error instanceof Error ? error.message : "Vui lòng thử lại"
                showToast.error("Không thể tạo nội dung", message)
            } finally {
                setLoading(false)
            }
        },
        [moduleTitle, addXP]
    )

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next)
                if (!next) reset()
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-slate-700 dark:text-slate-200 gap-2 rounded-lg border-slate-200 dark:border-slate-700">
                    <BookOpen className="w-4 h-4" /> Resources
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {active ? (
                            <button
                                type="button"
                                onClick={reset}
                                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                aria-label="Back"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        ) : null}
                        <span>{active ? active.title : "Study resources"}</span>
                    </DialogTitle>
                    {!active ? (
                        <DialogDescription>
                            For <span className="font-semibold text-slate-900 dark:text-white">{moduleTitle}</span>
                        </DialogDescription>
                    ) : null}
                </DialogHeader>

                {!active ? (
                    <ResourceList
                        resources={aiResources}
                        moduleTitle={moduleTitle}
                        onSelect={fetchContent}
                    />
                ) : loading ? (
                    <LoadingPanel type={active.type} />
                ) : content ? (
                    <ContentPanel type={active.type} content={content} />
                ) : (
                    <p className="text-sm text-slate-500 py-6 text-center">
                        Không có nội dung. Hãy thử lại.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}

function ResourceList({
    resources,
    moduleTitle,
    onSelect,
}: {
    resources: RoadmapResource[]
    moduleTitle: string
    onSelect: (type: ResourceType, title: string) => void
}) {
    // If AI didn't pre-fill resources, offer the 4 default types directly.
    const items = resources.length > 0
        ? resources.map((r) => ({ type: normalizeType(r.type), title: r.title }))
        : (Object.keys(TYPE_META) as ResourceType[]).map((type) => ({
            type,
            title: `${TYPE_META[type].label} · ${moduleTitle}`,
        }))

    return (
        <div className="grid gap-2 py-2">
            {items.map((item, idx) => {
                const meta = TYPE_META[item.type]
                const Icon = meta.Icon
                return (
                    <button
                        key={`${item.title}-${idx}`}
                        type="button"
                        onClick={() => onSelect(item.type, item.title)}
                        className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors text-left"
                    >
                        <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800",
                            meta.accent
                        )}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{meta.label}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                )
            })}
        </div>
    )
}

function LoadingPanel({ type }: { type: ResourceType }) {
    return (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
                AI đang chuẩn bị {TYPE_META[type].label.toLowerCase()}…
            </p>
        </div>
    )
}

function ContentPanel({ type, content }: { type: ResourceType; content: Content }) {
    if (type === "Reading") return <ReadingView content={content as Reading} />
    if (type === "Quiz") return <QuizView content={content as Quiz} />
    if (type === "Flashcard") return <FlashcardsView content={content as Flashcards} />
    return <ExercisesView content={content as Exercises} />
}

function Markdown({ children, className }: { children: string; className?: string }) {
    return (
        <div
            className={cn(
                "prose prose-slate dark:prose-invert max-w-none",
                "prose-p:leading-7 prose-p:my-2",
                "prose-headings:font-semibold prose-headings:tracking-tight",
                "prose-code:rounded prose-code:bg-slate-100 dark:prose-code:bg-slate-800/80 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none",
                "prose-pre:rounded-lg prose-pre:bg-slate-900 prose-pre:text-slate-100",
                "prose-li:my-1 prose-ul:my-2 prose-ol:my-2",
                "prose-strong:text-slate-900 dark:prose-strong:text-white",
                "prose-a:text-indigo-600 dark:prose-a:text-indigo-400",
                className,
            )}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
    )
}

function ReadingView({ content }: { content: Reading }) {
    return (
        <article className="py-2">
            <header className="mb-6 pb-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight mb-2">
                    {content.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {content.summary}
                </p>
            </header>
            <div className="space-y-7">
                {content.sections.map((section, idx) => (
                    <section key={idx} className="space-y-2">
                        <h4 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                            {section.heading}
                        </h4>
                        <Markdown className="text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                            {section.body}
                        </Markdown>
                    </section>
                ))}
            </div>
            <section className="mt-8 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/40 p-5">
                <h4 className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-3">
                    Key takeaways
                </h4>
                <ul className="space-y-2">
                    {content.keyTakeaways.map((k, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                            <span className="text-indigo-500 mt-0.5 shrink-0">→</span>
                            <span>{k}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </article>
    )
}

function QuizView({ content }: { content: Quiz }) {
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [submitted, setSubmitted] = useState(false)

    const score = submitted
        ? content.questions.filter((q) => answers[q.id] === q.correctAnswer).length
        : 0
    const total = content.questions.length
    const pct = submitted ? Math.round((score / total) * 100) : 0
    const allAnswered = Object.keys(answers).length === total
    const wrongQuestions = submitted
        ? content.questions.filter((q) => answers[q.id] !== q.correctAnswer)
        : []

    const retry = () => {
        setAnswers({})
        setSubmitted(false)
    }

    return (
        <div className="space-y-5 py-2">
            {/* Result card on top once submitted */}
            <AnimatePresence>
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        className="rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-900/20 p-5 flex items-center gap-4"
                    >
                        <div className="relative w-16 h-16 shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="26" className="stroke-indigo-200/60 dark:stroke-indigo-900/50" strokeWidth="6" fill="none" />
                                <motion.circle
                                    cx="32" cy="32" r="26"
                                    className="stroke-indigo-500"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 26}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - pct / 100) }}
                                    transition={{ duration: 0.9, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-900 dark:text-white">
                                {pct}%
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {score} / {total} correct
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                {pct >= 80 ? "Excellent — you've got this." : pct >= 50 ? "Good start — review the misses below." : "Worth another pass after re-reading."}
                            </p>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {content.questions.map((q, idx) => {
                const picked = answers[q.id]
                return (
                    <div key={q.id} className="space-y-2">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">
                            {idx + 1}. {q.text}
                        </p>
                        <div className="space-y-1.5">
                            {q.options.map((opt, i) => {
                                const isPicked = picked === opt
                                const isRight = submitted && opt === q.correctAnswer
                                const isWrong = submitted && isPicked && opt !== q.correctAnswer
                                return (
                                    <motion.button
                                        key={i}
                                        type="button"
                                        disabled={submitted}
                                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                                        whileTap={!submitted ? { scale: 0.99 } : undefined}
                                        className={cn(
                                            "w-full text-left text-sm px-3.5 py-2.5 rounded-lg border transition-colors flex items-center justify-between gap-2",
                                            isRight && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
                                            isWrong && "border-rose-500 bg-rose-50 dark:bg-rose-900/20",
                                            !submitted && isPicked && "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-900/20",
                                            !isPicked && !isRight && !isWrong && "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                        )}
                                    >
                                        <span>{opt}</span>
                                        {isRight ? <span aria-hidden className="text-emerald-600 font-semibold">✓</span> : null}
                                        {isWrong ? <span aria-hidden className="text-rose-600 font-semibold">✗</span> : null}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

            {!submitted ? (
                <Button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    disabled={!allAnswered}
                    className="w-full h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold disabled:opacity-50"
                >
                    {allAnswered ? "Submit answers" : `Answer all ${total} questions`}
                </Button>
            ) : (
                <>
                    {wrongQuestions.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-900/10 p-5 space-y-4"
                        >
                            <header className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                                    Review {wrongQuestions.length} miss{wrongQuestions.length === 1 ? "" : "es"}
                                </span>
                            </header>
                            <ul className="space-y-3">
                                {wrongQuestions.map((q) => (
                                    <li key={q.id} className="rounded-lg bg-white dark:bg-slate-900/60 border border-rose-200/60 dark:border-rose-900/30 p-3 space-y-1.5">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{q.text}</p>
                                        <p className="text-xs text-rose-700 dark:text-rose-300">
                                            <span className="font-semibold">Your answer:</span>{" "}
                                            <span className="line-through opacity-80">{answers[q.id] || "—"}</span>
                                        </p>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                            <span className="font-semibold">Correct:</span> {q.correctAnswer}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ) : null}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={retry}
                        className="w-full h-11 rounded-xl font-semibold"
                    >
                        Try again
                    </Button>
                </>
            )}
        </div>
    )
}

function FlashcardsView({ content }: { content: Flashcards }) {
    const [idx, setIdx] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [direction, setDirection] = useState<1 | -1>(1)
    const total = content.flashcards.length
    const card = content.flashcards[idx]

    const goPrev = useCallback(() => {
        setDirection(-1)
        setFlipped(false)
        setIdx((i) => Math.max(0, i - 1))
    }, [])
    const goNext = useCallback(() => {
        setDirection(1)
        setFlipped(false)
        setIdx((i) => Math.min(total - 1, i + 1))
    }, [total])

    // Keyboard: ← → navigate · Space/Enter flip.
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
            if (e.key === "ArrowLeft") { e.preventDefault(); goPrev() }
            else if (e.key === "ArrowRight") { e.preventDefault(); goNext() }
            else if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                setFlipped((v) => !v)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [goPrev, goNext])

    if (!card) return null

    return (
        <div className="space-y-5 py-2">
            <div
                className="relative h-80 select-none"
                style={{ perspective: "1200px", perspectiveOrigin: "50% 35%" }}
            >
                {/* Deck layers — also tilted in 3D so they look stacked behind */}
                {idx + 2 < total ? (
                    <div
                        aria-hidden
                        className="absolute inset-x-8 top-4 bottom-0 rounded-3xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800"
                        style={{ transform: "translateZ(-40px) rotateX(2deg)" }}
                    />
                ) : null}
                {idx + 1 < total ? (
                    <div
                        aria-hidden
                        className="absolute inset-x-4 top-2 bottom-0 rounded-3xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700"
                        style={{ transform: "translateZ(-20px) rotateX(1deg)" }}
                    />
                ) : null}

                {/* Active card — slide-in/out per index, flip via rotateY */}
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={idx}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <FlippableCard
                            front={card.front}
                            back={card.back}
                            flipped={flipped}
                            onFlip={() => setFlipped((v) => !v)}
                            onSwipeLeft={goNext}
                            onSwipeRight={goPrev}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5">
                {content.flashcards.map((_, i) => (
                    <motion.span
                        key={i}
                        aria-hidden
                        animate={{
                            width: i === idx ? 24 : 6,
                            opacity: i === idx ? 1 : i < idx ? 0.6 : 0.4,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={cn(
                            "h-1.5 rounded-full",
                            i === idx
                                ? "bg-indigo-500"
                                : i < idx
                                    ? "bg-emerald-500"
                                    : "bg-slate-300 dark:bg-slate-700"
                        )}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={goPrev} disabled={idx === 0}>
                    ← Previous
                </Button>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">Space</kbd> lật ·
                    <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">←</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">→</kbd> chuyển ·
                    kéo ngang để swipe
                </span>
                <Button type="button" onClick={goNext} disabled={idx === total - 1}>
                    Next →
                </Button>
            </div>
        </div>
    )
}

function ExercisesView({ content }: { content: Exercises }) {
    const [revealed, setRevealed] = useState<Record<number, boolean>>({})
    return (
        <div className="space-y-5 py-2">
            <p className="text-sm text-slate-600 dark:text-slate-300 italic">{content.intro}</p>
            {content.exercises.map((ex, idx) => {
                const open = revealed[idx]
                return (
                    <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white whitespace-pre-line">
                                {ex.prompt}
                            </p>
                        </div>
                        <details className="text-sm">
                            <summary className="cursor-pointer text-indigo-600 dark:text-indigo-300 font-medium">
                                Show hint
                            </summary>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">{ex.hint}</p>
                        </details>
                        {open ? (
                            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-200 dark:border-slate-700">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Solution</p>
                                <Markdown className="text-sm text-slate-800 dark:text-slate-200">
                                    {ex.solution}
                                </Markdown>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setRevealed((r) => ({ ...r, [idx]: true }))}
                                className="w-full"
                            >
                                Reveal solution
                            </Button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}


// Slide variants when navigating between cards.
const slideVariants = {
    enter: (dir: number) => ({
        x: dir * 160,
        opacity: 0,
        scale: 0.92,
        rotateZ: dir * 4,
    }),
    center: { x: 0, opacity: 1, scale: 1, rotateZ: 0 },
    exit: (dir: number) => ({
        x: dir * -160,
        opacity: 0,
        scale: 0.92,
        rotateZ: dir * -4,
    }),
}

interface FlippableCardProps {
    front: string
    back: string
    flipped: boolean
    onFlip: () => void
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
}

function FlippableCard({ front, back, flipped, onFlip, onSwipeLeft, onSwipeRight }: FlippableCardProps) {
    // Two-layer composition to prevent transform property conflicts:
    //   • OUTER: drag (swipe), tap-to-flip, hover/tap scale
    //   • INNER: pure 3D flip + lift (rotateY + shadow keyframes)
    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.28}
            dragMomentum={false}
            onDragEnd={(_, info) => {
                if (info.offset.x < -100 && onSwipeLeft) onSwipeLeft()
                else if (info.offset.x > 100 && onSwipeRight) onSwipeRight()
            }}
            onTap={() => onFlip()}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            transition={{ scale: { type: "spring", stiffness: 380, damping: 26 } }}
            role="button"
            aria-pressed={flipped}
            aria-label={flipped ? "Show front" : "Show back"}
            tabIndex={0}
            className="absolute inset-0 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 rounded-3xl"
        >
            <motion.div
                key={flipped ? "back" : "front"}
                className="absolute inset-0 rounded-3xl"
                style={{
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                    rotateY: flipped ? 180 : 0,
                    // Card "lifts off" the surface mid-flip then settles
                    boxShadow: [
                        "0 18px 40px -22px rgba(15,23,42,0.32), 0 6px 14px -6px rgba(15,23,42,0.14)",
                        "0 38px 70px -20px rgba(15,23,42,0.42), 0 12px 28px -10px rgba(15,23,42,0.20)",
                        "0 18px 40px -22px rgba(15,23,42,0.32), 0 6px 14px -6px rgba(15,23,42,0.14)",
                    ],
                }}
                transition={{
                    rotateY: { type: "spring", stiffness: 130, damping: 17, mass: 0.95 },
                    boxShadow: { duration: 0.65, times: [0, 0.5, 1], ease: "easeOut" },
                }}
            >
                <CardFace label="Front" hint="Tap • Swipe • Space">
                    <p className="text-lg md:text-2xl font-semibold text-slate-900 dark:text-white whitespace-pre-line leading-snug">
                        {front}
                    </p>
                </CardFace>
                <CardFace label="Back" hint="Tap to flip back" rotated>
                    <p className="text-base md:text-lg text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                        {back}
                    </p>
                </CardFace>
            </motion.div>
        </motion.div>
    )
}

interface CardFaceProps {
    label: string
    hint?: string
    rotated?: boolean
    children: ReactNode
}

function CardFace({ label, hint, rotated, children }: CardFaceProps) {
    return (
        <div
            className={cn(
                "absolute inset-0 rounded-3xl overflow-hidden border",
                "flex flex-col items-center justify-center text-center p-8 md:p-10",
                rotated
                    ? "bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            )}
            style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: rotated ? "rotateY(180deg)" : undefined,
            }}
        >
            {/* Top accent stripe — colored on back, neutral on front */}
            <div
                aria-hidden
                className={cn(
                    "absolute top-0 left-8 right-8 h-px rounded-full",
                    rotated
                        ? "bg-indigo-400"
                        : "bg-slate-300 dark:bg-slate-700"
                )}
            />
            {/* Top-left specular highlight (rim light) */}
            <div
                aria-hidden
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 65% 45% at 25% 0%, rgba(255,255,255,0.65), transparent 60%)",
                    mixBlendMode: "soft-light",
                }}
            />
            {/* Bottom soft shadow (contact) */}
            <div
                aria-hidden
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 dark:opacity-25"
                style={{
                    background:
                        "radial-gradient(ellipse 90% 50% at 50% 100%, rgba(15,23,42,0.18), transparent 60%)",
                }}
            />
            {/* Corner glint (subtle gold/indigo gleam) */}
            <div
                aria-hidden
                className={cn(
                    "absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-40",
                    rotated ? "bg-indigo-300 dark:bg-indigo-500/40" : "bg-amber-200 dark:bg-amber-400/15"
                )}
            />
            <span className="absolute top-4 left-5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                {label}
            </span>
            {hint ? (
                <span className="absolute bottom-4 right-5 text-[10px] text-slate-400 dark:text-slate-500">
                    {hint}
                </span>
            ) : null}
            <div className="max-w-prose w-full relative z-10">
                {children}
            </div>
        </div>
    )
}
