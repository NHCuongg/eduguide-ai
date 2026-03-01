import { NextResponse } from 'next/server'
import { geminiModel } from "@/lib/gemini"
import { cache } from "@/lib/cache"
import { rateLimit, aiRateLimiter } from "@/lib/rate-limit"
import { z } from "zod"

const FlashcardSchema = z.object({
    front: z.string(),
    back: z.string(),
})

const FlashcardsResponseSchema = z.object({
    topic: z.string(),
    flashcards: z.array(FlashcardSchema),
})

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

        const { topic, context } = await req.json()

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
        }

        const cacheKey = cache.generateKey(`flashcards:${topic}`, context)

        const parsedData = await cache.getOrSet(
            cacheKey,
            async () => {
                const prompt = `
      Create a set of 5-10 high-quality flashcards for the topic: "${topic}".
      ${context ? `Context: ${context}` : ''}
      
      Each flashcard should have a "front" (question/term) and a "back" (answer/definition).
      Keep them concise and effective for learning.
      
      Return ONLY valid JSON in the following format:
      {
        "topic": "${topic}",
        "flashcards": [
          { "front": "Question 1", "back": "Answer 1" },
          { "front": "Question 2", "back": "Answer 2" }
        ]
      }
    `

                const result = await geminiModel.generateContent({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
                const response = await result.response
                const text = response.text()

                const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()

                const data = JSON.parse(cleanText)
                return FlashcardsResponseSchema.parse(data)
            },
            60 * 60 * 1000 
        )

        return NextResponse.json(parsedData)
    } catch (error) {
        console.error('Error generating flashcards:', error)
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 })
    }
}
