import { genAI } from "@/lib/gemini"
import { cache } from "@/lib/cache"
import { rateLimit, aiRateLimiter } from "@/lib/rate-limit"
import { NextResponse } from "next/server"
import { z } from "zod"

const quizSchema = z.object({
  topic: z.string(),
  skillLevel: z.string().optional().default("Intermediate"),
})

export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(req, aiRateLimiter)
    if (rateLimitResult && !rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString()
          }
        }
      )
    }

    const body = await req.json()
    const { topic, skillLevel } = quizSchema.parse(body)

    // Generate cache key
    const cacheKey = cache.generateKey(`quiz:${topic}`, skillLevel)

    // Try to get from cache or generate new
    const data = await cache.getOrSet(
      cacheKey,
      async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

        const prompt = `
          You are an expert examiner. Create a 5-question multiple-choice quiz about: ${topic}.
          Target Audience Level: ${skillLevel}.
          
          Return JSON format ONLY (raw JSON, no markdown):
          {
            "questions": [
              {
                "id": 1,
                "text": "Question text here?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "Option A" // Must match one of the options exactly
              }
            ]
          }
        `

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        })
        const response = await result.response
        const text = response.text()

        // Clean potentially markdown blocks
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim()

        return JSON.parse(jsonString)
      },
      60 * 60 * 1000 // Cache for 1 hour
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error("Quiz Generation Error:", error)
    return NextResponse.json({
      error: "Failed to generate quiz",
      // Mock data for fallback if API fails
      mock: true,
      questions: [
        {
          id: 1,
          text: `What is a fundamental concept of this topic?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctAnswer: "Concept A"
        }
      ]
    }, { status: 500 })
  }
}
