import { genAI } from "@/lib/gemini"
import { onboardingSchema } from "@/lib/schemas"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = onboardingSchema.parse(body)

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Construct prompt for Gemini
    const prompt = `
      You are an elite Academic Curriculum Designer.
      Create a rigorous, structured syllabus for a university-level course.

      The user wants to learn: ${data.targetSkill}
      Current Level: ${data.currentLevel}
      Learning Style: ${data.learningStyle}
      Timeframe: ${data.deadline}

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
                "resources": [
                  { "title": "Resource Name", "url": "URL or keywords", "type": "Article/Video/Paper" }
                ]
              }
            ]
          }
        ]
      }

      Create exactly 3 phases with 3-4 modules each. Focus on depth and academic rigor.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean potential markdown blocks if Gemini adds them
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim()

    return NextResponse.json(JSON.parse(jsonString))

  } catch (error) {
    console.error("AI Error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    return NextResponse.json({
      // Fallback/Mock for demo if API key is missing
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
