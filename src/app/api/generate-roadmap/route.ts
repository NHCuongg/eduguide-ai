import { auth } from "@/auth"
import { createGeneratorRoute } from "@/lib/api-generator"
import { llmModels } from "@/lib/llm"
import { onboardingSchema } from "@/lib/schemas"
import { z } from "zod"

const resourceTypes = ["Flashcard", "Quiz", "Reading", "Exercise"] as const
const ROADMAP_CACHE_TTL = 24 * 60 * 60 * 1000

const RoadmapResponseSchema = z.object({
  title: z.string().min(1),
  phases: z
    .array(
      z.object({
        name: z.string().min(1),
        goal: z.string().min(1),
        modules: z
          .array(
            z.object({
              title: z.string().min(1),
              description: z.string().min(1),
              estimatedTime: z.string().min(1),
              resources: z
                .array(
                  z.object({
                    title: z.string().min(1),
                    url: z.string().min(1),
                    type: z.enum(resourceTypes),
                  })
                )
                .min(1),
            })
          )
          .min(3)
          .max(4),
      })
    )
    .length(3),
})

const ROADMAP_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description: "A personalized course title for the user",
      minLength: 1,
    },
    phases: {
      type: "array",
      description: "Exactly three ordered learning phases",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: {
            type: "string",
            description: "Phase name",
            minLength: 1,
          },
          goal: {
            type: "string",
            description: "One concise sentence describing the phase objective",
            minLength: 1,
          },
          modules: {
            type: "array",
            description: "Three to four learning modules for the phase",
            minItems: 3,
            maxItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string", minLength: 1, description: "Module title" },
                description: { type: "string", minLength: 1, description: "Short academic summary" },
                estimatedTime: { type: "string", minLength: 1, description: "Estimated study time" },
                resources: {
                  type: "array",
                  minItems: 1,
                  maxItems: 6,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      title: { type: "string", minLength: 1, description: "Resource title" },
                      url: { type: "string", minLength: 1, description: "URL or search keywords" },
                      type: {
                        type: "string",
                        enum: resourceTypes,
                        description: "Must be one of Flashcard, Quiz, Reading, or Exercise",
                      },
                    },
                    required: ["title", "url", "type"],
                  },
                },
              },
              required: ["title", "description", "estimatedTime", "resources"],
            },
          },
        },
        required: ["name", "goal", "modules"],
      },
    },
  },
  required: ["title", "phases"],
} as const

function buildRoadmapCachePayload(data: z.infer<typeof onboardingSchema>) {
  return {
    targetSkill: data.targetSkill,
    currentLevel: data.currentLevel,
    learningStyle: data.learningStyle,
    availability: data.availability,
    deadline: data.deadline,
    primaryGoal: data.primaryGoal,
    interests: [...data.interests].map((interest) => interest.trim().toLowerCase()).sort(),
    contentPreference: data.contentPreference,
    background: data.background?.trim() || "",
    strengths: data.strengths?.trim() || "",
    weaknesses: data.weaknesses?.trim() || "",
  }
}

function toResourceUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return "https://www.google.com/search?q=study+resource"
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
}

function normalizeRoadmap(roadmap: z.infer<typeof RoadmapResponseSchema>) {
  return {
    title: roadmap.title.trim(),
    phases: roadmap.phases.map((phase) => ({
      name: phase.name.trim(),
      goal: phase.goal.trim(),
      modules: phase.modules.map((module) => ({
        title: module.title.trim(),
        description: module.description.trim(),
        estimatedTime: module.estimatedTime.trim(),
        resources: module.resources.map((resource) => ({
          title: resource.title.trim(),
          type: resource.type,
          url: toResourceUrl(resource.url),
        })),
      })),
    })),
  }
}

export const POST = createGeneratorRoute({
  namespace: "roadmap",
  schemaName: "study_roadmap",
  jsonSchema: ROADMAP_JSON_SCHEMA,
  validator: RoadmapResponseSchema,
  inputSchema: onboardingSchema,
  model: llmModels.roadmap,
  cacheTtlMs: ROADMAP_CACHE_TTL,
  systemPrompt:
    "You are an elite academic curriculum designer. Return only valid JSON that matches the provided schema.",
  invalidRequestMessage: "Invalid onboarding data",
  logLabel: "Roadmap",
  requireAuth: async () => {
    const session = await auth()
    return session?.user ? { allowed: true, userId: session.user.id } : { allowed: false }
  },
  buildCachePayload: buildRoadmapCachePayload,
  postProcess: (roadmap) => normalizeRoadmap(roadmap) as z.infer<typeof RoadmapResponseSchema>,
  buildUserPrompt: (data) => `
Create a rigorous, structured syllabus for a university-level course.

USER PROFILE:
- Wants to learn: ${data.targetSkill}
- Current Level: ${data.currentLevel}
- Learning Style: ${data.learningStyle}
- Available time per week: ${data.availability} hours
- Timeframe: ${data.deadline}
- Primary Goal: ${data.primaryGoal}
- Interests: ${data.interests.join(", ")}
- Preferred content format: ${data.contentPreference}
- Background/Experience: ${data.background || "Not specified"}
- Strengths: ${data.strengths || "Not specified"}
- Weaknesses: ${data.weaknesses || "Not specified"}

Rules:
- Create exactly 3 phases with 3-4 modules each.
- Each phase must include a short goal sentence.
- Keep the curriculum personalized to the user's background, strengths, and weaknesses.
- Each module description should be 2-3 concise academic sentences.
- Include realistic time estimates like 30m, 45m, 1h, or 2h.
- Resource types must only be Flashcard, Quiz, Reading, or Exercise.
- Do not suggest video materials.
- Use direct HTTPS URLs when known; otherwise provide concise search keywords in the url field.
          `,
})
