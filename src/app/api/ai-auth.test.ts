import { beforeEach, describe, expect, test, vi } from "vitest"

const authMock = vi.hoisted(() => vi.fn())
const generateStructuredObjectMock = vi.hoisted(() => vi.fn())

vi.mock("@/auth", () => ({
  auth: authMock,
}))

vi.mock("@/lib/llm", () => ({
  llmModels: {
    roadmap: "test-roadmap-model",
    quiz: "test-quiz-model",
    flashcards: "test-flashcards-model",
  },
  generateStructuredObject: generateStructuredObjectMock,
}))

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("AI generator API auth", () => {
  beforeEach(() => {
    vi.resetModules()
    authMock.mockReset()
    generateStructuredObjectMock.mockReset()
    generateStructuredObjectMock.mockImplementation(({ schemaName }) => {
      if (schemaName === "topic_quiz") {
        return {
          questions: Array.from({ length: 5 }).map((_, index) => ({
            id: index + 1,
            text: `Question ${index + 1}`,
            options: ["A", "B", "C", "D"],
            correctAnswer: "A",
          })),
        }
      }

      return {
        topic: "React",
        flashcards: Array.from({ length: 5 }).map((_, index) => ({
          front: `Front ${index + 1}`,
          back: `Back ${index + 1}`,
        })),
      }
    })
  })

  test("rejects unauthenticated quiz generation", async () => {
    authMock.mockResolvedValue(null)

    const { POST } = await import("./generate-quiz/route")
    const response = await POST(jsonRequest({ topic: "React", skillLevel: "Beginner" }))

    expect(response.status).toBe(401)
    expect(generateStructuredObjectMock).not.toHaveBeenCalled()
  })

  test("rejects unauthenticated flashcard generation", async () => {
    authMock.mockResolvedValue(null)

    const { POST } = await import("./generate-flashcards/route")
    const response = await POST(jsonRequest({ topic: "React" }))

    expect(response.status).toBe(401)
    expect(generateStructuredObjectMock).not.toHaveBeenCalled()
  })
})
