import { generateStructuredObject } from "@/lib/llm"
import { getJobSpec } from "./registry"
import type { LlmJobData, LlmJobResult } from "./llm-queue"

export async function runLlmJob(data: LlmJobData): Promise<LlmJobResult> {
    const spec = getJobSpec(data.namespace)
    if (!spec) {
        throw new Error(`No job spec registered for namespace "${data.namespace}"`)
    }

    const raw = await generateStructuredObject({
        model: spec.model,
        schemaName: spec.schemaName,
        jsonSchema: spec.jsonSchema,
        validator: spec.validator,
        systemPrompt: spec.systemPrompt,
        userPrompt: data.userPrompt,
    })

    const output = spec.postProcess ? spec.postProcess(raw) : raw
    return { data: output }
}
