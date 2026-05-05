import { auth } from "@/auth"
import { cache } from "@/lib/cache"
import { generateText, llmModels, type LlmChatMessage } from "@/lib/llm"
import { chatRateLimiter, rateLimit } from "@/lib/rate-limit"
import { NextResponse } from "next/server"
import { z } from "zod"

const CHAT_RATE_LIMIT = 15
const CHAT_WINDOW_MS = 60 * 1000
const CHAT_CACHE_TTL = 15 * 60 * 1000

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1500),
})

const contextSchema = z.object({
  courseTitle: z.string().trim().min(1).max(200).optional(),
  phaseName: z.string().trim().min(1).max(200).optional(),
  moduleTitle: z.string().trim().min(1).max(200).optional(),
  moduleDescription: z.string().trim().min(1).max(1200).optional(),
  estimatedTime: z.string().trim().min(1).max(80).optional(),
  resources: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(200),
        type: z.string().trim().min(1).max(50).optional(),
        url: z.string().trim().min(1).max(500).optional(),
      })
    )
    .max(6)
    .optional(),
})

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(12),
  context: contextSchema.optional(),
})

function buildRateLimitHeaders(resetAt: number) {
  return {
    "X-RateLimit-Limit": CHAT_RATE_LIMIT.toString(),
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": resetAt.toString(),
    "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
  }
}

function buildContextPrompt(context?: z.infer<typeof contextSchema>) {
  if (!context) {
    return ""
  }

  const resourceLines =
    context.resources?.length
      ? context.resources
          .map((resource) => `- ${resource.title}${resource.type ? ` (${resource.type})` : ""}`)
          .join("\n")
      : "None provided"

  return `
Current learning context:
- Course: ${context.courseTitle || "Not specified"}
- Phase: ${context.phaseName || "Not specified"}
- Module: ${context.moduleTitle || "General study support"}
- Module description: ${context.moduleDescription || "Not specified"}
- Estimated time: ${context.estimatedTime || "Not specified"}
- Related resources:
${resourceLines}
  `.trim()
}

export async function POST(req: Request) {
  const rateLimitResult = await rateLimit(req, chatRateLimiter, CHAT_RATE_LIMIT, CHAT_WINDOW_MS)
  if (rateLimitResult && !rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: buildRateLimitHeaders(rateLimitResult.resetAt),
      }
    )
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
  }

  let payload: z.infer<typeof chatRequestSchema>

  try {
    payload = chatRequestSchema.parse(await req.json())
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid chat request", details: error.flatten() }, { status: 400 })
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  try {
    const contextPrompt = buildContextPrompt(payload.context)

    const messages: LlmChatMessage[] = [
      {
        role: "system",
        content:
          "You are EduMate AI, a concise and reliable study coach. Use the provided lesson context when it helps. If the context is incomplete, say so clearly instead of inventing facts. Prefer short paragraphs or flat bullets. Do not use markdown tables.",
      },
      ...(contextPrompt ? [{ role: "system" as const, content: contextPrompt }] : []),
      ...payload.messages.slice(-8),
    ]

    const userMessages = payload.messages.filter((msg) => msg.role === "user")
    const lastUserMessage = userMessages[userMessages.length - 1]
    const isSingleShot = userMessages.length === 1 && lastUserMessage !== undefined
    const cacheable = isSingleShot && lastUserMessage.content.length <= 400

    let cacheStatus: "HIT" | "MISS" | "BYPASS" = "BYPASS"

    if (cacheable) {
      const cacheKey = cache.generateKey("chat", {
        context: payload.context ?? null,
        prompt: lastUserMessage.content,
      })

      const cached = await cache.get<string>(cacheKey)
      if (cached !== null) {
        return NextResponse.json(
          { message: cached },
          { headers: { "X-Cache": "HIT" } }
        )
      }

      const message = await generateText({
        model: llmModels.roadmap,
        messages,
        temperature: 0.5,
      })

      await cache.set(cacheKey, message, CHAT_CACHE_TTL)
      cacheStatus = "MISS"

      return NextResponse.json({ message }, { headers: { "X-Cache": cacheStatus } })
    }

    const message = await generateText({
      model: llmModels.roadmap,
      messages,
      temperature: 0.5,
    })

    return NextResponse.json({ message }, { headers: { "X-Cache": cacheStatus } })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 502 })
  }
}
