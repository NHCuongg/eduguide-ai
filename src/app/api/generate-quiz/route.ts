import { createGeneratorRoute } from "@/lib/api-generator"
import { llmModels } from "@/lib/llm"
import { z } from "zod"

const quizSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required"),
  skillLevel: z.string().trim().min(1).optional().default("Intermediate"),
})

const QuizResponseSchema = z.object({
  questions: z
    .array(
      z
        .object({
          id: z.number().int().positive(),
          text: z.string().min(1),
          options: z.array(z.string().min(1)).length(4),
          correctAnswer: z.string().min(1),
        })
        .refine((question) => question.options.includes(question.correctAnswer), {
          message: "correctAnswer must match one of the options",
        })
    )
    .length(5),
})

const QUIZ_JSON_SCHEMA = {
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

export const POST = createGeneratorRoute({
  namespace: "quiz",
  schemaName: "topic_quiz",
  jsonSchema: QUIZ_JSON_SCHEMA,
  validator: QuizResponseSchema,
  inputSchema: quizSchema,
  model: llmModels.quiz,
  systemPrompt: "You are an expert examiner. Return only valid JSON that matches the provided schema.",
  invalidRequestMessage: "Invalid quiz request",
  logLabel: "Quiz",
  buildUserPrompt: ({ topic, skillLevel }) => `
Create a 5-question multiple-choice quiz about: ${topic}
Target audience level: ${skillLevel}

Rules:
- Produce exactly 5 questions.
- Each question must have exactly 4 answer options.
- correctAnswer must exactly match one of the options.
- Keep the difficulty aligned to the requested skill level.
          `,
})
