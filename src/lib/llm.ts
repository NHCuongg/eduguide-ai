import OpenAI from "openai"
import { z } from "zod"
import { env } from "./env"

export type JsonSchema =
  | {
      type: "string"
      description?: string
      enum?: readonly string[]
      minLength?: number
      maxLength?: number
    }
  | {
      type: "number" | "integer"
      description?: string
      minimum?: number
      maximum?: number
    }
  | {
      type: "boolean"
      description?: string
    }
  | {
      type: "array"
      description?: string
      items: JsonSchema
      minItems?: number
      maxItems?: number
    }
  | {
      type: "object"
      description?: string
      properties: Record<string, JsonSchema>
      required?: readonly string[]
      additionalProperties?: boolean
    }

export type JsonSchemaInput = JsonSchema

const openRouterBaseUrl = env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"

const defaultHeaders: Record<string, string> = {}
if (env.OPENROUTER_SITE_URL) {
  defaultHeaders["HTTP-Referer"] = env.OPENROUTER_SITE_URL
}
if (env.OPENROUTER_SITE_NAME) {
  defaultHeaders["X-OpenRouter-Title"] = env.OPENROUTER_SITE_NAME
}

let _llm: OpenAI | null = null

export function getLlmClient(): OpenAI {
  if (!_llm) {
    _llm = new OpenAI({
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: openRouterBaseUrl,
      ...(Object.keys(defaultHeaders).length > 0 ? { defaultHeaders } : {}),
    })
  }

  return _llm
}

export const llm = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return (getLlmClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const llmModels = {
  roadmap: env.OPENROUTER_MODEL_ROADMAP || "openai/gpt-4o-mini",
  quiz: env.OPENROUTER_MODEL_QUIZ || "openai/gpt-4o-mini",
  flashcards: env.OPENROUTER_MODEL_FLASHCARDS || "google/gemini-2.5-flash-lite",
} as const

export type LlmChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

type StructuredGenerationOptions<T> = {
  model: string
  schemaName: string
  jsonSchema: JsonSchema
  systemPrompt: string
  userPrompt: string
  validator: z.ZodType<T>
  temperature?: number
}

function normalizeContent(content: unknown): string {
  if (typeof content === "string") {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "object" && part && "text" in part && typeof part.text === "string") {
          return part.text
        }

        return ""
      })
      .join("")
  }

  return ""
}

function stripMarkdownFences(value: string): string {
  return value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
}

function shouldRetryWithoutSchema(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  return (
    message.includes("json_schema") ||
    message.includes("structured output") ||
    message.includes("response_format") ||
    message.includes("unsupported parameter") ||
    message.includes("does not support")
  )
}

function parseStructuredResponse<T>(rawContent: unknown, validator: z.ZodType<T>): T {
  const text = stripMarkdownFences(normalizeContent(rawContent))
  if (!text) {
    throw new Error("LLM returned empty content")
  }

  return validator.parse(JSON.parse(text))
}

export async function generateStructuredObject<T>({
  model,
  schemaName,
  jsonSchema,
  systemPrompt,
  userPrompt,
  validator,
  temperature = 0.2,
}: StructuredGenerationOptions<T>): Promise<T> {
  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ]

  try {
    const completion = await llm.chat.completions.create({
      model,
      messages,
      temperature,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          strict: true,
          schema: jsonSchema,
        },
      },
    })

    return parseStructuredResponse(completion.choices[0]?.message?.content, validator)
  } catch (error) {
    if (!shouldRetryWithoutSchema(error)) {
      throw error
    }

    const completion = await llm.chat.completions.create({
      model,
      messages,
      temperature,
      response_format: { type: "json_object" },
    })

    return parseStructuredResponse(completion.choices[0]?.message?.content, validator)
  }
}

type TextGenerationOptions = {
  model: string
  messages: LlmChatMessage[]
  temperature?: number
}

export async function generateText({
  model,
  messages,
  temperature = 0.4,
}: TextGenerationOptions): Promise<string> {
  const completion = await llm.chat.completions.create({
    model,
    messages,
    temperature,
  })

  const text = normalizeContent(completion.choices[0]?.message?.content).trim()
  if (!text) {
    throw new Error("LLM returned empty content")
  }

  return text
}
