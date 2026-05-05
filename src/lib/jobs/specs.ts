import { z } from "zod"
import { llmModels } from "@/lib/llm"
import {
    EXERCISE_SYSTEM_PROMPT,
    FLASHCARD_SYSTEM_PROMPT,
    QUIZ_SYSTEM_PROMPT,
    READING_SYSTEM_PROMPT,
    ROADMAP_SYSTEM_PROMPT,
} from "@/lib/prompts"
import type { JobSpec } from "@/lib/queue/registry"

const FLASHCARDS_SPEC: JobSpec = (() => {
    const FlashcardSchema = z.object({
        front: z.string().min(1),
        back: z.string().min(1),
    })
    const validator = z.object({
        topic: z.string().min(1),
        flashcards: z.array(FlashcardSchema).min(5).max(10),
    })
    const jsonSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            topic: { type: "string", minLength: 1, description: "The topic the flashcards are about" },
            flashcards: {
                type: "array",
                minItems: 5,
                maxItems: 10,
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        front: { type: "string", minLength: 1, description: "Question, prompt, or term" },
                        back: { type: "string", minLength: 1, description: "Answer, definition, or explanation" },
                    },
                    required: ["front", "back"],
                },
            },
        },
        required: ["topic", "flashcards"],
    } as const
    return {
        namespace: "flashcards",
        schemaName: "flashcard_deck",
        jsonSchema,
        validator,
        model: llmModels.flashcards,
        systemPrompt: FLASHCARD_SYSTEM_PROMPT,
    }
})()

const QUIZ_SPEC: JobSpec = (() => {
    const validator = z.object({
        questions: z
            .array(
                z
                    .object({
                        id: z.number().int().positive(),
                        text: z.string().min(1),
                        options: z.array(z.string().min(1)).length(4),
                        correctAnswer: z.string().min(1),
                    })
                    .refine((q) => q.options.includes(q.correctAnswer), {
                        message: "correctAnswer must match one of the options",
                    })
            )
            .length(5),
    })
    const jsonSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            questions: {
                type: "array",
                minItems: 5,
                maxItems: 5,
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        id: { type: "integer", minimum: 1, description: "Sequential question number" },
                        text: { type: "string", minLength: 1, description: "Question text" },
                        options: {
                            type: "array",
                            minItems: 4,
                            maxItems: 4,
                            items: { type: "string", minLength: 1, description: "Answer option" },
                        },
                        correctAnswer: {
                            type: "string",
                            minLength: 1,
                            description: "Must exactly match one of the options",
                        },
                    },
                    required: ["id", "text", "options", "correctAnswer"],
                },
            },
        },
        required: ["questions"],
    } as const
    return {
        namespace: "quiz",
        schemaName: "topic_quiz",
        jsonSchema,
        validator,
        model: llmModels.quiz,
        systemPrompt: QUIZ_SYSTEM_PROMPT,
    }
})()

const ROADMAP_RESOURCE_TYPES = ["Flashcard", "Quiz", "Reading", "Exercise"] as const

const RoadmapValidator = z.object({
    title: z.string().min(1).max(200),
    phases: z
        .array(
            z.object({
                name: z.string().min(1).max(200),
                goal: z.string().min(1).max(500),
                modules: z
                    .array(
                        z.object({
                            title: z.string().min(1).max(200),
                            description: z.string().min(1).max(1000),
                            estimatedTime: z.string().min(1).max(50),
                            resources: z
                                .array(
                                    z.object({
                                        title: z.string().min(1).max(200),
                                        url: z.string().min(1).max(500),
                                        type: z.enum(ROADMAP_RESOURCE_TYPES),
                                    })
                                )
                                .min(1)
                                .max(8),
                        })
                    )
                    .min(2)
                    .max(6),
            })
        )
        .min(2)
        .max(5),
})

export type RoadmapPayload = z.infer<typeof RoadmapValidator>

function normalizeRoadmap(roadmap: RoadmapPayload): RoadmapPayload {
    return {
        title: roadmap.title.trim(),
        phases: roadmap.phases.map((phase) => ({
            name: phase.name.trim(),
            goal: phase.goal.trim(),
            modules: phase.modules.map((mod) => ({
                title: mod.title.trim(),
                description: mod.description.trim(),
                estimatedTime: mod.estimatedTime.trim(),
                resources: mod.resources.map((r) => ({
                    title: r.title.trim(),
                    type: r.type,
                    url: "",
                })),
            })),
        })),
    }
}

const ROADMAP_SPEC: JobSpec<RoadmapPayload> = {
    namespace: "roadmap",
    schemaName: "study_roadmap",
    jsonSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
            title: { type: "string", description: "Personalized course title" },
            phases: {
                type: "array",
                description: "Ordered learning phases (target 3, but 2-5 acceptable)",
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        name: { type: "string", description: "Phase name" },
                        goal: { type: "string", description: "One concise sentence describing the phase objective" },
                        modules: {
                            type: "array",
                            description: "Learning modules (target 3-4 per phase)",
                            items: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    title: { type: "string", description: "Module title" },
                                    description: { type: "string", description: "Short academic summary, 2-3 sentences" },
                                    estimatedTime: { type: "string", description: "Estimated study time, e.g. 30m, 1h, 2h" },
                                    resources: {
                                        type: "array",
                                        description: "Resources for the module (1-3 typical)",
                                        items: {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                title: { type: "string", description: "Resource title" },
                                                url: { type: "string", description: "Direct https URL or search keywords" },
                                                type: {
                                                    type: "string",
                                                    enum: ROADMAP_RESOURCE_TYPES,
                                                    description: "Flashcard, Quiz, Reading, or Exercise",
                                                },
                                            },
                                            required: ["title", "url", "type"],
                                        },
                                    },
                                },
                                required: ["title", "description", "estimatedTime", "resources"],
                            },
                        },
                    },
                    required: ["name", "goal", "modules"],
                },
            },
        },
        required: ["title", "phases"],
    },
    validator: RoadmapValidator,
    model: llmModels.roadmap,
    systemPrompt: ROADMAP_SYSTEM_PROMPT,
    postProcess: normalizeRoadmap,
}

export const ROADMAP_VALIDATOR = RoadmapValidator
export const ROADMAP_RESOURCE_ENUM = ROADMAP_RESOURCE_TYPES

const EXERCISE_SPEC: JobSpec = (() => {
    const validator = z.object({
        title: z.string().min(1).max(200),
        intro: z.string().min(1).max(400),
        exercises: z
            .array(
                z.object({
                    prompt: z.string().min(1).max(2000),
                    hint: z.string().min(1).max(500),
                    solution: z.string().min(1).max(4000),
                })
            )
            .min(2)
            .max(6),
    })
    const jsonSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            title: { type: "string", description: "Specific name for the practice set" },
            intro: { type: "string", description: "1-2 sentence intro to what skill the set targets" },
            exercises: {
                type: "array",
                description: "3-5 problems ordered easy → hard",
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        prompt: { type: "string", description: "Concrete instructions with inputs/constraints" },
                        hint: { type: "string", description: "Nudge toward the first move, not the answer" },
                        solution: { type: "string", description: "Markdown worked solution with reasoning" },
                    },
                    required: ["prompt", "hint", "solution"],
                },
            },
        },
        required: ["title", "intro", "exercises"],
    } as const
    return {
        namespace: "exercise",
        schemaName: "practice_exercises",
        jsonSchema,
        validator,
        model: llmModels.roadmap,
        systemPrompt: EXERCISE_SYSTEM_PROMPT,
    }
})()

const READING_SPEC: JobSpec = (() => {
    const validator = z.object({
        title: z.string().min(1).max(200),
        summary: z.string().min(1).max(500),
        sections: z
            .array(
                z.object({
                    heading: z.string().min(1).max(120),
                    body: z.string().min(1).max(4000),
                })
            )
            .min(2)
            .max(7),
        keyTakeaways: z.array(z.string().min(1).max(300)).min(2).max(8),
    })
    const jsonSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            title: { type: "string", description: "Specific title (not generic)" },
            summary: { type: "string", description: "1-2 sentences capturing the core insight" },
            sections: {
                type: "array",
                description: "3-5 sections; each builds on the previous",
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        heading: { type: "string", description: "Concise noun phrase" },
                        body: { type: "string", description: "Markdown body, 120-220 words" },
                    },
                    required: ["heading", "body"],
                },
            },
            keyTakeaways: {
                type: "array",
                description: "3-5 single-sentence bullets",
                items: { type: "string" },
            },
        },
        required: ["title", "summary", "sections", "keyTakeaways"],
    } as const
    return {
        namespace: "reading",
        schemaName: "study_reading",
        jsonSchema,
        validator,
        model: llmModels.roadmap,
        systemPrompt: READING_SYSTEM_PROMPT,
    }
})()

export const FLASHCARDS_JOB_SPEC = FLASHCARDS_SPEC
export const QUIZ_JOB_SPEC = QUIZ_SPEC
export const ROADMAP_JOB_SPEC = ROADMAP_SPEC
export const EXERCISE_JOB_SPEC = EXERCISE_SPEC
export const READING_JOB_SPEC = READING_SPEC

export const ALL_LLM_JOB_SPECS: JobSpec[] = [
    FLASHCARDS_SPEC,
    QUIZ_SPEC,
    ROADMAP_SPEC as JobSpec,
    EXERCISE_SPEC,
    READING_SPEC,
]
