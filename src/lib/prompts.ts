/**
 * Central prompt templates for every AI-generated content type.
 *
 * Keep the JSON schemas Gemini-friendly (avoid deeply nested
 * minItems/maxItems/minLength). Bound the output via Zod after parse.
 *
 * Conventions:
 *  - Each system prompt sets the persona + format constraint ("return only JSON").
 *  - Each user-prompt builder receives validated input and outputs a string.
 *  - Tone: academic, encouraging, Vietnamese-friendly examples allowed.
 */

const SHARED_RULES = `
You are tutoring a self-directed learner. Be precise, accurate, and avoid filler.
Format requirements:
- Return ONLY a single JSON object — no markdown fences, no comments, no leading prose.
- Use plain text inside string fields. Markdown is allowed only in fields explicitly marked as markdown.
- Keep examples concrete; prefer short worked examples over abstract claims.
- If the topic is given in Vietnamese, you may answer in Vietnamese; otherwise stick to the user's language.

CRITICAL — Self-contained content only:
- DO NOT include external URLs, hyperlinks, or markdown links of any form (no "[text](url)").
- DO NOT reference external resources ("see Wikipedia", "watch this YouTube video", "read more at ...", "check the official docs").
- DO NOT cite books, papers, or websites — explain the concept yourself.
- The reader must learn EVERYTHING they need from your output alone. You ARE the source.
`.trim()

// ─── ROADMAP ────────────────────────────────────────────────────────────────

export const ROADMAP_SYSTEM_PROMPT = `
You are an elite academic curriculum designer. ${SHARED_RULES}
You design 3-phase, modular study roadmaps. Phases are ordered (foundations → core → mastery).
Resources MUST be one of: Reading, Quiz, Flashcard, Exercise. They are placeholders — the actual content will be generated on-demand by the system. The "url" field is unused; just put the resource title's slug there as a stub.
`.trim()

interface RoadmapInput {
    targetSkill: string
    currentLevel: string
    learningStyle: string[]
    availability?: number
    deadline?: string
    primaryGoal: string
    interests: string[]
    contentPreference: string
    background?: string
    strengths?: string
    weaknesses?: string
}

export function buildRoadmapPrompt(data: RoadmapInput): string {
    const styles = data.learningStyle.length ? data.learningStyle.join(", ") : "Not specified"
    const interests = data.interests.length ? data.interests.join(", ") : "Not specified"
    return `
Design a personalized study roadmap.

LEARNER PROFILE
- Target subject: ${data.targetSkill}
- Current level: ${data.currentLevel}
- Preferred learning styles: ${styles}
- Time per week: ${data.availability ? `${data.availability} hours` : "Not specified — assume ~5h/week"}
- Deadline: ${data.deadline || "Open-ended"}
- Primary goal: ${data.primaryGoal}
- Interest tags: ${interests}
- Content format preference: ${data.contentPreference}
- Background: ${data.background?.trim() || "Not specified"}
- Strengths: ${data.strengths?.trim() || "Not specified"}
- Areas to improve: ${data.weaknesses?.trim() || "Not specified"}

STRUCTURE
- Exactly 3 phases (Foundations / Core / Mastery feel — name them in the subject's voice).
- Each phase has 3-4 modules sized to fit the weekly availability.
- Each module has: title, 2-3 sentence description, estimatedTime (e.g. "30m", "1h", "2h"),
  and a resources array.
- Per-module resources should mix the user's selected styles:
    - "Reading"   → if Reading style chosen
    - "Flashcard" → if Flashcard style chosen
    - "Exercise"  → if Hands-on style chosen
    - "Quiz"      → always include at least one near the end of each phase
- Generate 1-3 resources per module. The url field can be search keywords; it's OK because the platform auto-generates the actual content.

QUALITY
- Tie every module to the learner's stated goal and weaknesses. Mention concrete examples drawn from their interests.
- Pace difficulty so a learner with the stated availability can finish before the deadline.
- Avoid filler like "Introduction to ..."; use specific, outcome-oriented titles.
`.trim()
}

// ─── READING ────────────────────────────────────────────────────────────────

export const READING_SYSTEM_PROMPT = `
You are an academic tutor writing a complete, standalone study reading. ${SHARED_RULES}
You produce self-contained reading material consumed in 5-10 minutes — the learner needs no other resource to understand the topic. Teach as if no other source exists.
`.trim()

interface ReadingInput {
    topic: string
    moduleTitle?: string
    skillLevel?: string
    interests?: string[]
}

export function buildReadingPrompt(data: ReadingInput): string {
    const interestLine = data.interests?.length
        ? `- Learner interests (use for examples when relevant): ${data.interests.join(", ")}`
        : ""
    return `
Write a study reading on: "${data.topic}"
${data.moduleTitle ? `Module context: ${data.moduleTitle}` : ""}
- Target audience level: ${data.skillLevel ?? "Intermediate"}
${interestLine}

STRUCTURE
- title: a clear, specific title (NOT generic like "Introduction to ...").
- summary: 1-2 sentences capturing the key insight.
- sections: 3-5 sections. Each section has:
    - heading (concise noun phrase, no numbers)
    - body (markdown, 120-220 words). Use short paragraphs, code/equations/lists where helpful.
- keyTakeaways: 3-5 single-sentence bullets that crystallize what to remember.

QUALITY BAR
- Lead with the *core idea* in the first section, then unpack mechanism, then show a worked example.
- One concrete example per section. Make up specific numbers, code, or scenarios — don't reference external sources.
- No filler ("In this article we will...", "As you can see..."). Show, don't announce.
- ABSOLUTELY NO external links, "for more info see X", citations to books/sites, or "watch this video".
- If you would normally link to a Wikipedia article, instead INCLUDE the explanation directly in the section body.
`.trim()
}

// ─── QUIZ ───────────────────────────────────────────────────────────────────

export const QUIZ_SYSTEM_PROMPT = `
You are an exam writer. ${SHARED_RULES}
Write multiple-choice questions that probe conceptual understanding, not rote memorization.
`.trim()

interface QuizInput {
    topic: string
    skillLevel?: string
}

export function buildQuizPrompt(data: QuizInput): string {
    return `
Write a 5-question multiple-choice quiz on: "${data.topic}"
Target audience level: ${data.skillLevel ?? "Intermediate"}

STRUCTURE
- Exactly 5 questions, numbered 1-5.
- Each question has 4 options (A-D, but use plain strings). Exactly one is correct.
- correctAnswer must EXACTLY match the text of the right option (no prefix like "A.").
- Each question is 1-2 sentences and self-contained.

QUALITY
- Test understanding: distinguish concepts, predict outcomes, identify mistakes.
- Distractors must be plausible — each one should reflect a common misconception or partial understanding, not be obviously wrong.
- Avoid "All of the above" / "None of the above".
- Spread the correct answer position across A/B/C/D — don't always put it first.
- Keep wording neutral and unambiguous.
`.trim()
}

// ─── FLASHCARD ──────────────────────────────────────────────────────────────

export const FLASHCARD_SYSTEM_PROMPT = `
You design spaced-repetition flashcards. ${SHARED_RULES}
Cards must be atomic (one concept each), front-prompt + back-answer style.
`.trim()

interface FlashcardInput {
    topic: string
    context?: string
}

export function buildFlashcardPrompt(data: FlashcardInput): string {
    return `
Create 5-10 flashcards for the topic: "${data.topic}"
${data.context ? `Context: ${data.context}` : ""}

STRUCTURE
- topic: must equal "${data.topic}".
- flashcards: 5-10 cards, each with:
    - front: a question, term, prompt, or "what / why / how" cue (1-2 lines)
    - back: a precise answer or definition (2-4 lines max)

QUALITY (Anki-style)
- Each card tests ONE atomic fact. If you'd need a paragraph, split into multiple cards.
- Prefer cloze-style or definition cards over open-ended essays.
- Mix card types: definitions, cause→effect, contrasts ("X vs Y"), worked-mini-example.
- Avoid duplication or near-duplicates.
- Use the topic's own terminology — don't paraphrase domain terms.
`.trim()
}

// ─── EXERCISE ───────────────────────────────────────────────────────────────

export const EXERCISE_SYSTEM_PROMPT = `
You are a hands-on instructor designing practice problems. ${SHARED_RULES}
Each exercise is a small, self-contained task with a concrete outcome.
`.trim()

interface ExerciseInput {
    topic: string
    moduleTitle?: string
    skillLevel?: string
}

export function buildExercisePrompt(data: ExerciseInput): string {
    return `
Design a hands-on practice set for: "${data.topic}"
${data.moduleTitle ? `Module context: ${data.moduleTitle}` : ""}
- Target audience level: ${data.skillLevel ?? "Intermediate"}

STRUCTURE
- title: a short, specific name for the practice set.
- intro: 1-2 sentences explaining the skill the set targets.
- exercises: 3-5 problems, each with:
    - prompt: clear instructions, includes any given inputs/constraints.
    - hint: 1-2 sentences nudging the approach without revealing the answer.
    - solution: full worked solution with reasoning steps and final answer (markdown, code blocks allowed).

QUALITY
- Order from easier to harder; the first problem should be solvable in 1-2 minutes.
- Each prompt is concrete (specific numbers, code snippets, or scenarios) — never just "explain X".
- Hints should reveal the *first move*, not the whole answer.
- Solutions explain WHY, not just WHAT — show the reasoning a tutor would walk through.
- Self-contained: do NOT link out, cite external books/sites, or say "look up X". The solution must teach by itself.
`.trim()
}
