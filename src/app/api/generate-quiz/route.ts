import { genAI } from "@/lib/gemini"
import { NextResponse } from "next/server"
import { z } from "zod"

const quizSchema = z.object({
  topic: z.string(),
  skillLevel: z.string().optional().default("Intermediate"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { topic, skillLevel } = quizSchema.parse(body)

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

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean potentially markdown blocks
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim()

    return NextResponse.json(JSON.parse(jsonString))
  } catch (error) {
    console.error("Quiz Generation Error:", error)
    return NextResponse.json({
      error: "Failed to generate quiz",
      // Mock data for fallback if API fails
      mock: true,
      questions: [
        {
          id: 1,
          text: `What is a fundamental concept of ${JSON.parse(await req.text()).topic}?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctAnswer: "Concept A"
        }
      ]
    }, { status: 500 })
  }
}
