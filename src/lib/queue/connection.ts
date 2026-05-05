import IORedis, { type Redis } from "ioredis"
import { child } from "@/lib/logger"

const log = child("queue:redis")

declare global {
    var __bullmqRedis: Redis | null | undefined
}

export function getQueueRedis(): Redis {
    if (globalThis.__bullmqRedis) return globalThis.__bullmqRedis

    const url = process.env.REDIS_URL?.trim()
    if (!url) {
        throw new Error("REDIS_URL is required for the job queue")
    }

    const client = new IORedis(url, {
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
    })

    client.on("error", (err) => {
        log.warn({ err: err.message }, "connection error")
    })

    globalThis.__bullmqRedis = client
    return client
}
