import Redis from "ioredis"

declare global {
    var __redisClient: Redis | null | undefined
}

let warned = false

export function getRedis(): Redis | null {
    const url = process.env.REDIS_URL?.trim()
    if (!url) {
        if (!warned && process.env.NODE_ENV !== "production") {
            console.info("[rate-limit] REDIS_URL not set; falling back to in-memory store (not safe across processes)")
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
                console.warn("[redis] connection error:", err.message)
            }
        })
        globalThis.__redisClient = client
        return client
    } catch (error) {
        console.warn("[redis] failed to create client", error)
        globalThis.__redisClient = null
        return null
    }
}
