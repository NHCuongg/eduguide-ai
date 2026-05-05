import "dotenv/config"
import { Worker, type Job } from "bullmq"
import { LLM_QUEUE_NAME, type LlmJobData, type LlmJobResult } from "@/lib/queue/llm-queue"
import { runLlmJob } from "@/lib/queue/executor"
import { getQueueRedis } from "@/lib/queue/connection"
import { cache } from "@/lib/cache"
import { child } from "@/lib/logger"
import "./manifest"

const log = child("worker")
const concurrency = Number(process.env.WORKER_CONCURRENCY || 4)

log.info({ concurrency }, "starting LLM worker")

const worker = new Worker<LlmJobData, LlmJobResult>(
    LLM_QUEUE_NAME,
    async (job: Job<LlmJobData, LlmJobResult>) => {
        const t0 = Date.now()
        const ctx = { jobId: job.id, namespace: job.data.namespace }
        log.info(ctx, "job starting")

        const result = await runLlmJob(job.data)

        await cache.set(job.data.cacheKey, result.data, job.data.cacheTtlMs).catch((err) => {
            log.warn({ ...ctx, err }, "cache set failed")
        })

        log.info({ ...ctx, ms: Date.now() - t0 }, "job done")
        return result
    },
    {
        connection: getQueueRedis(),
        concurrency,
    }
)

worker.on("failed", (job, err) => {
    const attemptsMade = job?.attemptsMade ?? 0
    const attemptsAllowed = (job?.opts?.attempts as number | undefined) ?? 1
    const exhausted = attemptsMade >= attemptsAllowed
    log.error(
        {
            jobId: job?.id,
            namespace: job?.data?.namespace,
            attemptsMade,
            attemptsAllowed,
            exhausted,
            err: err.message,
        },
        exhausted ? "job exhausted retries (dead-letter)" : "job attempt failed"
    )
})

worker.on("error", (err) => {
    log.error({ err }, "worker error")
})

const shutdown = async (signal: string) => {
    log.info({ signal }, "received shutdown signal")
    try {
        await worker.close()
    } catch (err) {
        log.error({ err }, "error during shutdown")
    } finally {
        process.exit(0)
    }
}

process.on("SIGTERM", () => void shutdown("SIGTERM"))
process.on("SIGINT", () => void shutdown("SIGINT"))
