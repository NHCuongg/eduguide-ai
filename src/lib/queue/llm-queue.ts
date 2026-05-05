import { Queue, QueueEvents } from "bullmq"
import { getQueueRedis } from "./connection"

export const LLM_QUEUE_NAME = "llm-jobs"

export interface LlmJobData {
    namespace: string
    userPrompt: string
    cacheKey: string
    cacheTtlMs: number
    userId?: string
}

export interface LlmJobResult {
    data: unknown
}

declare global {
    var __llmQueue: Queue<LlmJobData, LlmJobResult> | undefined
    var __llmQueueEvents: QueueEvents | undefined
}

export function getLlmQueue(): Queue<LlmJobData, LlmJobResult> {
    if (globalThis.__llmQueue) return globalThis.__llmQueue

    const queue = new Queue<LlmJobData, LlmJobResult>(LLM_QUEUE_NAME, {
        connection: getQueueRedis(),
        defaultJobOptions: {
            attempts: 3,
            backoff: { type: "exponential", delay: 1_000 },
            removeOnComplete: { age: 60 * 60, count: 1000 },
            removeOnFail: { age: 24 * 60 * 60, count: 1000 },
        },
    })

    globalThis.__llmQueue = queue
    return queue
}

export function getLlmQueueEvents(): QueueEvents {
    if (globalThis.__llmQueueEvents) return globalThis.__llmQueueEvents

    const events = new QueueEvents(LLM_QUEUE_NAME, {
        connection: getQueueRedis(),
    })

    globalThis.__llmQueueEvents = events
    return events
}

export interface EnqueueOptions {
    userId?: string
    cacheKey: string
    cacheTtlMs: number
}

/**
 * BullMQ rejects custom job IDs containing `:` (its internal key separator).
 * Cache keys carry colons (`cache:v3:flashcards:...`) so we sanitise to `_`
 * for the jobId only — the cache key itself stays untouched in the payload.
 */
function cacheKeyToJobId(cacheKey: string): string {
    return cacheKey.replace(/:/g, "_")
}

export async function enqueueLlmJob(
    namespace: string,
    userPrompt: string,
    options: EnqueueOptions
): Promise<string> {
    const queue = getLlmQueue()
    const jobId = cacheKeyToJobId(options.cacheKey)
    const job = await queue.add(
        namespace,
        {
            namespace,
            userPrompt,
            cacheKey: options.cacheKey,
            cacheTtlMs: options.cacheTtlMs,
            userId: options.userId,
        },
        {
            jobId,
        }
    )

    if (!job.id) {
        throw new Error("Job ID missing after enqueue")
    }

    return job.id
}
