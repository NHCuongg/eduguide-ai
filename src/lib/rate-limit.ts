import { getRedis } from "./redis"

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetAt: number
}

interface RateLimitEntry {
    count: number
    resetAt: number
}

export class RateLimiter {
    private store = new Map<string, RateLimitEntry>()
    private defaultLimit: number
    private defaultWindow: number
    private namespace: string

    constructor(limit: number = 10, windowMs: number = 60 * 1000, namespace: string = "rl") {
        this.defaultLimit = limit
        this.defaultWindow = windowMs
        this.namespace = namespace
    }

    getIdentifier(req: Request): string {
        const forwarded = req.headers.get("x-forwarded-for")
        const realIp = req.headers.get("x-real-ip")
        const connectingIp = req.headers.get("cf-connecting-ip")
        const ip = forwarded?.split(",")[0]?.trim() || realIp || connectingIp || "unknown"
        return ip
    }

    async check(
        identifier: string,
        limit?: number,
        windowMs?: number
    ): Promise<RateLimitResult> {
        const limitValue = limit ?? this.defaultLimit
        const window = windowMs ?? this.defaultWindow

        const redis = getRedis()
        if (redis) {
            try {
                return await this.checkRedis(redis, identifier, limitValue, window)
            } catch (error) {
                if (process.env.NODE_ENV !== "production") {
                    console.warn("[rate-limit] redis check failed, falling back to memory:", error)
                }
            }
        }

        return this.checkMemory(identifier, limitValue, window)
    }

    private async checkRedis(
        redis: ReturnType<typeof getRedis> & object,
        identifier: string,
        limitValue: number,
        window: number
    ): Promise<RateLimitResult> {
        const key = `${this.namespace}:${identifier}`

        // INCR + PEXPIRE on first hit only.
        const pipeline = redis.multi()
        pipeline.incr(key)
        pipeline.pttl(key)
        const result = await pipeline.exec()

        if (!result) throw new Error("redis pipeline returned null")
        const count = Number(result[0]?.[1] ?? 0)
        let pttl = Number(result[1]?.[1] ?? -1)

        if (pttl < 0) {
            await redis.pexpire(key, window)
            pttl = window
        }

        const resetAt = Date.now() + pttl
        if (count > limitValue) {
            return { allowed: false, remaining: 0, resetAt }
        }
        return {
            allowed: true,
            remaining: Math.max(0, limitValue - count),
            resetAt,
        }
    }

    private checkMemory(identifier: string, limitValue: number, window: number): RateLimitResult {
        const key = identifier
        const now = Date.now()
        const entry = this.store.get(key)

        if (!entry || entry.resetAt < now) {
            const newEntry: RateLimitEntry = { count: 1, resetAt: now + window }
            this.store.set(key, newEntry)
            return { allowed: true, remaining: limitValue - 1, resetAt: newEntry.resetAt }
        }

        if (entry.count >= limitValue) {
            return { allowed: false, remaining: 0, resetAt: entry.resetAt }
        }

        entry.count++
        this.store.set(key, entry)
        return { allowed: true, remaining: limitValue - entry.count, resetAt: entry.resetAt }
    }

    cleanExpired(): void {
        const now = Date.now()
        for (const [key, entry] of this.store.entries()) {
            if (entry.resetAt < now) {
                this.store.delete(key)
            }
        }
    }
}

export const apiRateLimiter = new RateLimiter(10, 60 * 1000, "rl:api")
export const aiRateLimiter = new RateLimiter(5, 60 * 1000, "rl:ai")
export const chatRateLimiter = new RateLimiter(15, 60 * 1000, "rl:chat")

if (typeof setInterval !== "undefined") {
    setInterval(() => {
        apiRateLimiter.cleanExpired()
        aiRateLimiter.cleanExpired()
        chatRateLimiter.cleanExpired()
    }, 5 * 60 * 1000)
}

export async function rateLimit(
    req: Request,
    limiter: RateLimiter = apiRateLimiter,
    limit?: number,
    windowMs?: number
): Promise<RateLimitResult | null> {
    try {
        const identifier = limiter.getIdentifier(req)
        return await limiter.check(identifier, limit, windowMs)
    } catch (error) {
        console.error("Rate limit error:", error)
        return null
    }
}
