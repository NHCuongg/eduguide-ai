import { auth } from "@/auth"
import { createGeneratorRoute } from "@/lib/api-generator"
import { llmModels } from "@/lib/llm"
import { z } from "zod"

const FlashcardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
})

const flashcardRequestSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required"),
  context: z.string().trim().optional(),
})

const FlashcardsResponseSchema = z.object({
  topic: z.string().min(1),
  flashcards: z.array(FlashcardSchema).min(5).max(10),
})

const FLASHCARDS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    topic: {
      type: "string",
      minLength: 1,
      description: "The topic the flashcards are about",
    },
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

export const POST = createGeneratorRoute({
  namespace: "flashcards",
  schemaName: "flashcard_deck",
  jsonSchema: FLASHCARDS_JSON_SCHEMA,
  validator: FlashcardsResponseSchema,
  inputSchema: flashcardRequestSchema,
  model: llmModels.flashcards,
  systemPrompt: "You create concise, high-retention study flashcards and return only valid JSON.",
  invalidRequestMessage: "Invalid flashcard request",
  logLabel: "Flashcards",
  requireAuth: async () => {
    const session = await auth()
    return session?.user ? { allowed: true, userId: session.user.id } : { allowed: false }
  },
  buildCachePayload: ({ topic, context }) => ({ topic, context: context || "" }),
  buildUserPrompt: ({ topic, context }) => `
Create a set of 5-10 high-quality flashcards for the topic: "${topic}".
${context ? `Context: ${context}` : ""}

Rules:
- Each flashcard must have a "front" and a "back".
- Keep each card concise, specific, and useful for spaced repetition.
- Prefer definitions, contrasts, key facts, and short concept checks.
- The topic field must remain "${topic}".
          `,
})
