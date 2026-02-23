import { genAI } from "@/lib/gemini"
import { onboardingSchema } from "@/lib/schemas"
import { cache } from "@/lib/cache"
import { rateLimit, aiRateLimiter } from "@/lib/rate-limit"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
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

    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const body = await req.json()
    const data = onboardingSchema.parse(body)

    const cacheKey = cache.generateKey(
      `roadmap:${data.targetSkill}`,
      `${data.currentLevel}:${data.learningStyle}:${data.deadline}:${data.background}:${data.strengths}`
    )

    const roadmap = await cache.getOrSet(
      cacheKey,
      async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

        const prompt = `
      You are an elite Academic Curriculum Designer.
      Create a rigorous, structured syllabus for a university-level course.

      USER PROFILE:
      - Wants to learn: ${data.targetSkill}
      - Current Level: ${data.currentLevel}
      - Learning Style: ${data.learningStyle}
      - Timeframe: ${data.deadline}
      - Background/Experience: ${data.background || 'Not specified'}
      - Strengths: ${data.strengths || 'Not specified'}
      - Weaknesses: ${data.weaknesses || 'Not specified'}

      Return a JSON object with this EXACT structure (do not use Markdown code blocks, just raw JSON):
      {
        "title": "Course Title (e.g. Advanced Molecular Biology)",
        "phases": [
          {
            "name": "Phase Name (e.g. Foundations)",
            "modules": [
              {
                "title": "Module Title",
                "description": "2-3 sentences academic summary of the lesson.",
                "estimatedTime": "Time estimate (e.g. 30m, 1h)",
                "resources": [
                  { "title": "Resource Name", "url": "URL or keywords", "type": "Flashcard" } // MUST ONLY BE ONE OF: Flashcard, Quiz, Reading, Exercise
                ]
              }
            ]
          }
        ]
      }

      CRITICAL RULE: The "type" for resources MUST ONLY BE ONE OF: "Flashcard", "Quiz", "Reading", or "Exercise". DO NOT suggest or create any video materials.
      Create exactly 3 phases with 3-4 modules each. Focus on depth, academic rigor, and personalize it to the user's background, strengths, and weaknesses if provided. Include realistic estimated times for each module.
    `

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        })
        const response = await result.response
        const text = response.text()

        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim()

        return JSON.parse(jsonString)
      },
      24 * 60 * 60 * 1000
    )

    return NextResponse.json(roadmap)

  } catch (error) {
    console.error("AI Error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    return NextResponse.json({
      mock: true,
      roadmap: {
        title: "Mock Roadmap (API Key Missing)",
        phases: [
          {
            name: "Phase 1: Foundations",
            modules: [{ title: "Basics of Subject", resources: [] }]
          }
        ]
      }
    }, { status: 500 })
  }
}
