import { z } from "zod"
import type { JsonSchemaInput } from "@/lib/llm"

export interface JobSpec<Output = unknown> {
    namespace: string
    schemaName: string
    jsonSchema: JsonSchemaInput
    validator: z.ZodType<Output>
    model: string
    systemPrompt: string
    postProcess?: (output: Output) => Output
}

const registry = new Map<string, JobSpec<unknown>>()

export function registerJobSpec<Output>(spec: JobSpec<Output>): void {
    registry.set(spec.namespace, spec as unknown as JobSpec<unknown>)
}

export function getJobSpec(namespace: string): JobSpec<unknown> | undefined {
    return registry.get(namespace)
}

export function listJobNamespaces(): string[] {
    return Array.from(registry.keys())
}
