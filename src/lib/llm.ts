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
      timeout: 60_000,
      maxRetries: 0,
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
    message.includes("does not support") ||
    message.includes("provider returned error") ||
    message.includes("invalid_argument") ||
    message.includes("too many states") ||
    message.includes("schema")
  )
}

function parseStructuredResponse<T>(rawContent: unknown, validator: z.ZodType<T>): T {
  const text = stripMarkdownFences(normalizeContent(rawContent))
  if (!text) {
    throw new Error("LLM returned empty content")
  }

  return validator.parse(JSON.parse(text))
}

function isRetryableUpstreamError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
  // OpenRouter often returns 429 / 502 / 503 when the picked provider is throttled.
  return (
    message.includes("rate-limited") ||
    message.includes("rate limit") ||
    message.includes("temporarily") ||
    message.includes("429") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504") ||
    message.includes("timeout") ||
    message.includes("etimedout") ||
    message.includes("econnreset") ||
    message.includes("upstream")
  )
}

async function withUpstreamRetry<T>(fn: () => Promise<T>, maxAttempts = 2): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!isRetryableUpstreamError(error) || attempt === maxAttempts - 1) {
        throw error
      }
      const delay = Math.min(800 * Math.pow(2, attempt), 2_000) + Math.floor(Math.random() * 300)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

// Models known not to support strict json_schema response format —
// skip the failed attempt and go directly to json_object to save 30-60s.
// We default to false (skip strict mode) since most proxies don't fully
// implement OpenAI's strict json_schema, and json_object + inline schema
// works universally.
function modelSupportsStrictJsonSchema(model: string): boolean {
  const lower = model.toLowerCase()
  if (lower.includes("deepseek")) return false
  if (lower.includes("gemini")) return false
  if (lower.includes("anthropic") || lower.includes("claude")) return false
  if (lower.includes("mistral")) return false
  if (lower.includes("llama")) return false
  // Only OpenAI's official models behind their own API have known stable
  // strict json_schema support. Treat third-party proxies / aliases (cx/...,
  // openrouter passthrough, etc.) as json_object-only for safety.
  return lower.startsWith("openai/") || /^(gpt-4o|gpt-4-turbo|gpt-4\.1|gpt-5)\b/i.test(model)
}

// OpenRouter "provider" preferences — load-balance + auto-fallback when a
// specific upstream is throttled (e.g., DeepInfra returning 429 for DeepSeek).
// Only applied when actually talking to OpenRouter; other OpenAI-compatible
// proxies may reject unknown fields.
const isOpenRouter = openRouterBaseUrl.includes("openrouter.ai")
const OPENROUTER_PROVIDER_PREFS = {
  sort: "throughput" as const,
  allow_fallbacks: true,
}

function withProviderPrefs<T extends object>(body: T): T {
  if (!isOpenRouter) return body
  return { ...body, provider: OPENROUTER_PROVIDER_PREFS } as unknown as T
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

  // For models without strict json_schema support, go directly to the
  // json_object path with the schema inlined in the prompt — saves 30-60s.
  if (!modelSupportsStrictJsonSchema(model)) {
    const fallbackMessages: LlmChatMessage[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${userPrompt}\n\nReturn ONLY a JSON object matching this exact JSON schema (no markdown, no comments):\n\n${JSON.stringify(jsonSchema, null, 2)}`,
      },
    ]

    const completion = await withUpstreamRetry(() =>
      llm.chat.completions.create(withProviderPrefs({
        model,
        messages: fallbackMessages,
        temperature,
        response_format: { type: "json_object" as const },
      }))
    )

    return parseStructuredResponse(completion.choices[0]?.message?.content, validator)
  }

  try {
    const completion = await withUpstreamRetry(() =>
      llm.chat.completions.create(withProviderPrefs({
        model,
        messages,
        temperature,
        response_format: {
          type: "json_schema" as const,
          json_schema: {
            name: schemaName,
            strict: true,
            schema: jsonSchema,
          },
        },
      }))
    )

    return parseStructuredResponse(completion.choices[0]?.message?.content, validator)
  } catch (error) {
    if (!shouldRetryWithoutSchema(error)) {
      throw error
    }

    const fallbackMessages: LlmChatMessage[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${userPrompt}\n\nReturn ONLY a JSON object matching this exact JSON schema (no markdown, no comments):\n\n${JSON.stringify(jsonSchema, null, 2)}`,
      },
    ]

    const completion = await withUpstreamRetry(() =>
      llm.chat.completions.create(withProviderPrefs({
        model,
        messages: fallbackMessages,
        temperature,
        response_format: { type: "json_object" as const },
      }))
    )

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
  const completion = await withUpstreamRetry(() =>
    llm.chat.completions.create(withProviderPrefs({
      model,
      messages,
      temperature,
    }))
  )

  const text = normalizeContent(completion.choices[0]?.message?.content).trim()
  if (!text) {
    throw new Error("LLM returned empty content")
  }

  return text
}
