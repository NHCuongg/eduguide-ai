import Redis from "ioredis"
import { child } from "@/lib/logger"

const log = child("redis")

declare global {
    var __redisClient: Redis | null | undefined
}

let warned = false

export function getRedis(): Redis | null {
    const url = process.env.REDIS_URL?.trim()
    if (!url) {
        if (!warned && process.env.NODE_ENV !== "production") {
            log.info("REDIS_URL not set; falling back to in-memory store")
            warned = true
        }
        return null
    }

    if (globalThis.__redisClient) {
        return globalThis.__redisClient
    }

    try {
        const client = new Redis(url, {
            lazyConnect: true,
            maxRetriesPerRequest: 2,
            enableOfflineQueue: false,
            connectTimeout: 5_000,
        })
        client.on("error", (err) => {
            // Avoid noisy logs; rate limiter will treat errors as fail-open via .catch in callers.
            if (process.env.NODE_ENV !== "production") {
                log.warn({ err: err.message }, "connection error")
            }
        })
        globalThis.__redisClient = client
        return client
    } catch (error) {
        log.warn({ err: error }, "failed to create client")
        globalThis.__redisClient = null
        return null
    }
}
