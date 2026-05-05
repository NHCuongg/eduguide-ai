import { NextResponse } from "next/server"
import { z } from "zod"
import { cache } from "./cache"
import { generateStructuredObject, type JsonSchemaInput } from "./llm"
import { child } from "./logger"
import { enqueueLlmJob } from "./queue/llm-queue"
import { registerJobSpec } from "./queue/registry"
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
  /** When true, cache entries are scoped per-user (prevents cross-user payload leak). */
  scopeByUser?: boolean
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
  const log = child(`api:${config.namespace}`)

  registerJobSpec({
    namespace: config.namespace,
    schemaName: config.schemaName,
    jsonSchema: config.jsonSchema,
    validator: config.validator,
    model: config.model,
    systemPrompt: config.systemPrompt,
    postProcess: config.postProcess as ((output: unknown) => unknown) | undefined,
  })

  return async function POST(req: Request): Promise<Response> {
    const t0 = Date.now()
    log.debug({ label: logLabel }, "request received")
    const rateLimitResult = await rateLimit(req, aiRateLimiter)
    log.debug({ ms: Date.now() - t0 }, "rate-limit checked")
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

    let cacheScope: string | undefined

    if (config.requireAuth) {
      const authResult = await config.requireAuth()
      log.debug({ allowed: authResult?.allowed, ms: Date.now() - t0 }, "auth checked")
      if (!authResult || !authResult.allowed) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
      }
      if (config.scopeByUser) cacheScope = authResult.userId
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

    const url = new URL(req.url)
    const wantsAsync =
      url.searchParams.get("async") === "1" || req.headers.get("x-async") === "1"

    if (wantsAsync) {
      try {
        const cachePayload = config.buildCachePayload
          ? config.buildCachePayload(parsedInput)
          : parsedInput
        const cacheKey = cache.generateKey(config.namespace, cachePayload, { scope: cacheScope })

        const cached = await cache.get<Output>(cacheKey)
        if (cached !== null) {
          return NextResponse.json({
            jobId: cacheKey,
            status: "completed",
            result: config.postProcess ? config.postProcess(cached) : cached,
          })
        }

        const userPrompt = config.buildUserPrompt(parsedInput)
        const jobId = await enqueueLlmJob(config.namespace, userPrompt, {
          userId: cacheScope,
          cacheKey,
          cacheTtlMs: cacheTtl,
        })
        log.info({ jobId, ms: Date.now() - t0 }, "enqueued job")
        return NextResponse.json({ jobId, status: "queued" }, { status: 202 })
      } catch (error) {
        log.error({ err: error }, "enqueue error")
        return NextResponse.json(
          { error: "Failed to enqueue job" },
          { status: 503 }
        )
      }
    }

    // Stream a heartbeat (one whitespace byte every 5s) while the LLM works.
    // JSON allows leading whitespace, so the final body is still valid JSON.
    // This keeps idle-connection-killing browsers (e.g., Snap Firefox at ~10s)
    // from dropping the request before the upstream finishes.
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder()
        // Flush headers & open the wire immediately.
        controller.enqueue(encoder.encode(" "))

        const heartbeat: NodeJS.Timeout = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(" "))
          } catch {
            // controller already closed
          }
        }, 5_000)

        const finish = (payload: unknown) => {
          clearInterval(heartbeat)
          try {
            controller.enqueue(encoder.encode(JSON.stringify(payload)))
          } finally {
            controller.close()
          }
        }

        try {
          const cachePayload = config.buildCachePayload
            ? config.buildCachePayload(parsedInput)
            : parsedInput
          const cacheKey = cache.generateKey(config.namespace, cachePayload, { scope: cacheScope })
          log.debug({ ms: Date.now() - t0 }, "LLM call starting")

          const raw = await Promise.race([
            cache.getOrSet(
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
            ),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("LLM call timeout after 40s")), 40_000)
            ),
          ])
          log.info({ ms: Date.now() - t0 }, "LLM call done")

          const output = config.postProcess ? config.postProcess(raw) : raw
          log.debug({ ms: Date.now() - t0 }, "returning response")
          finish(output)
        } catch (error) {
          log.error({ err: error }, "generation error")
          const message = error instanceof Error ? error.message : "Unknown error"
          const isUpstream = /provider|status|400|429|500|502|503|timeout|aborted/i.test(message)
          finish({
            error: isUpstream
              ? `AI provider rejected the request. Please try again or simplify your inputs.`
              : `Failed to generate ${config.namespace}.`,
            ...(process.env.NODE_ENV !== "production" ? { detail: message.slice(0, 400) } : {}),
          })
        }
      },
    })

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  }
}
