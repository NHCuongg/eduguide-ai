import { createHash } from "crypto"
import { getRedis } from "./redis"

// Bump to invalidate every cached AI payload (e.g. after a prompt or schema change).
const CACHE_VERSION = "v3"

interface CacheEntry<T> {
    data: T
    expiresAt: number
}

/**
 * Two-tier cache:
 *   1. In-memory Map (per-process) for instant pending-request dedup
 *   2. Redis (cross-process, persistent) when REDIS_URL is set
 *
 * Falls back gracefully to in-memory only if Redis is unreachable.
 * Used by AI generators to share warmups across requests and survive restarts.
 */
class HybridCache {
    private memory = new Map<string, CacheEntry<unknown>>()
    private pending = new Map<string, Promise<unknown>>()
    private defaultTTL = 60 * 60 * 1000

    generateKey(namespace: string, payload?: unknown, options?: { scope?: string }): string {
        const scopePart = options?.scope ? `u:${options.scope}` : "global"
        const hash = this.simpleHash(`${namespace}:${scopePart}:${this.serialize(payload)}`)
        return `cache:${CACHE_VERSION}:${namespace}:${scopePart}:${hash}`
    }

    private serialize(value: unknown): string {
        if (value == null) return ""
        if (typeof value === "string") return value.trim().replace(/\s+/g, " ").toLowerCase()
        if (typeof value === "number" || typeof value === "boolean") return String(value)
        if (Array.isArray(value)) return `[${value.map((item) => this.serialize(item)).join(",")}]`
        if (typeof value === "object") {
            const entries = Object.entries(value as Record<string, unknown>)
                .filter(([, v]) => v !== undefined)
                .sort(([a], [b]) => a.localeCompare(b))
            return `{${entries.map(([k, v]) => `${k}:${this.serialize(v)}`).join(",")}}`
        }
        return String(value)
    }

    private simpleHash(str: string): string {
        // SHA-256 truncated to 16 hex chars (~64 bits) — collision-safe for our scale,
        // shorter than full digest but ~2^32x harder to collide than the old 32-bit hash.
        return createHash("sha256").update(str).digest("hex").slice(0, 16)
    }

    private memoryGet<T>(key: string): T | null {
        const entry = this.memory.get(key) as CacheEntry<T> | undefined
        if (!entry) return null
        if (entry.expiresAt <= Date.now()) {
            this.memory.delete(key)
            return null
        }
        return entry.data
    }

    private memorySet<T>(key: string, data: T, ttlMs: number): void {
        this.memory.set(key, { data, expiresAt: Date.now() + ttlMs })
    }

    private async redisGet<T>(key: string): Promise<T | null> {
        const redis = getRedis()
        if (!redis) return null
        try {
            const raw = await redis.get(key)
            if (!raw) return null
            return JSON.parse(raw) as T
        } catch {
            return null
        }
    }

    private async redisSet<T>(key: string, data: T, ttlMs: number): Promise<void> {
        const redis = getRedis()
        if (!redis) return
        try {
            await redis.set(key, JSON.stringify(data), "PX", ttlMs)
        } catch {
            // best-effort; in-memory still holds it
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const local = this.memoryGet<T>(key)
        if (local !== null) return local

        const remote = await this.redisGet<T>(key)
        if (remote !== null) {
            // Populate L1 with remote-discovered value (use a small TTL so we don't drift).
            this.memorySet(key, remote, 60_000)
            return remote
        }
        return null
    }

    async set<T>(key: string, data: T, ttl: number = this.defaultTTL): Promise<T> {
        this.memorySet(key, data, ttl)
        await this.redisSet(key, data, ttl)
        return data
    }

    async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = this.defaultTTL
    ): Promise<T> {
        const cached = await this.get<T>(key)
        if (cached !== null) return cached

        const inflight = this.pending.get(key) as Promise<T> | undefined
        if (inflight) return inflight

        const promise = fetcher()
            .then(async (data) => {
                await this.set(key, data, ttl)
                return data
            })
            .finally(() => {
                this.pending.delete(key)
            })

        this.pending.set(key, promise as Promise<unknown>)
        return promise
    }

    async clear(key: string): Promise<void> {
        this.memory.delete(key)
        const redis = getRedis()
        if (redis) {
            try {
                await redis.del(key)
            } catch {
                // ignore
            }
        }
    }

    cleanExpired(): void {
        const now = Date.now()
        for (const [key, entry] of this.memory.entries()) {
            if (entry.expiresAt <= now) {
                this.memory.delete(key)
            }
        }
    }
}

export const cache = new HybridCache()

if (typeof setInterval !== "undefined") {
    setInterval(() => {
        cache.cleanExpired()
    }, 5 * 60 * 1000)
}
