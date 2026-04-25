import { NextResponse } from "next/server"
import { z } from "zod"
import { cache } from "./cache"
import { generateStructuredObject, type JsonSchemaInput } from "./llm"
import { aiRateLimiter, rateLimit } from "./rate-limit"

const DEFAULT_AI_RATE_LIMIT = 5
const DEFAULT_CACHE_TTL = 60 * 60 * 1000

type AuthCheck = () => Promise<{ allowed: boolean; userId?: string } | null>

type GeneratorRouteConfig<Input, Output> = {
  namespace: string
  schemaName: string
  jsonSchema: JsonSchemaInput
  validator: z.ZodType<Output>
  inputSchema: z.ZodType<Input>
  model: string
  systemPrompt: string
  buildUserPrompt: (input: Input) => string
  buildCachePayload?: (input: Input) => unknown
  postProcess?: (output: Output) => Output
  cacheTtlMs?: number
  rateLimitMax?: number
  requireAuth?: AuthCheck
  invalidRequestMessage?: string
  logLabel?: string
}

function buildRateLimitHeaders(resetAt: number, limit: number) {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": resetAt.toString(),
    "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
  }
}

export function createGeneratorRoute<Input, Output>(config: GeneratorRouteConfig<Input, Output>) {
  const cacheTtl = config.cacheTtlMs ?? DEFAULT_CACHE_TTL
  const rateLimitMax = config.rateLimitMax ?? DEFAULT_AI_RATE_LIMIT
  const invalidMessage = config.invalidRequestMessage ?? "Invalid request"
  const logLabel = config.logLabel ?? config.namespace

  return async function POST(req: Request): Promise<Response> {
    const rateLimitResult = await rateLimit(req, aiRateLimiter)
    if (rateLimitResult && !rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: buildRateLimitHeaders(rateLimitResult.resetAt, rateLimitMax),
        }
      )
    }

    if (config.requireAuth) {
      const authResult = await config.requireAuth()
      if (!authResult || !authResult.allowed) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
      }
    }

    let parsedInput: Input

    try {
      const body = await req.json()
      parsedInput = config.inputSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: invalidMessage, details: error.flatten() },
          { status: 400 }
        )
      }

      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    try {
      const cachePayload = config.buildCachePayload
        ? config.buildCachePayload(parsedInput)
        : parsedInput
      const cacheKey = cache.generateKey(config.namespace, cachePayload)

      const raw = await cache.getOrSet(
        cacheKey,
        async () =>
          generateStructuredObject({
            model: config.model,
            schemaName: config.schemaName,
            jsonSchema: config.jsonSchema,
            validator: config.validator,
            systemPrompt: config.systemPrompt,
            userPrompt: config.buildUserPrompt(parsedInput),
          }),
        cacheTtl
      )

      const output = config.postProcess ? config.postProcess(raw) : raw

      return NextResponse.json(output)
    } catch (error) {
      console.error(`${logLabel} generation error:`, error)
      return NextResponse.json({ error: `Failed to generate ${config.namespace}` }, { status: 502 })
    }
  }
}
