// Simple in-memory rate limiter
// For production, consider using @upstash/ratelimit or similar

interface RateLimitEntry {
    count: number
    resetAt: number
}

class RateLimiter {
    private store = new Map<string, RateLimitEntry>()
    private defaultLimit: number
    private defaultWindow: number

    constructor(limit: number = 10, windowMs: number = 60 * 1000) {
        this.defaultLimit = limit
        this.defaultWindow = windowMs
    }

    /**
     * Get client identifier from request
     */
    private getIdentifier(req: Request): string {
        // Try to get IP from headers (works with most proxies)
        const forwarded = req.headers.get('x-forwarded-for')
        const realIp = req.headers.get('x-real-ip')
        const ip = forwarded?.split(',')[0] || realIp || 'unknown'
        
        return ip
    }

    /**
     * Check if request should be rate limited
     */
    async check(
        identifier: string,
        limit?: number,
        windowMs?: number
    ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
        const key = identifier
        const limitValue = limit ?? this.defaultLimit
        const window = windowMs ?? this.defaultWindow
        const now = Date.now()

        const entry = this.store.get(key)

        if (!entry || entry.resetAt < now) {
            // Create new entry
            const newEntry: RateLimitEntry = {
                count: 1,
                resetAt: now + window
            }
            this.store.set(key, newEntry)
            return {
                allowed: true,
                remaining: limitValue - 1,
                resetAt: newEntry.resetAt
            }
        }

        if (entry.count >= limitValue) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: entry.resetAt
            }
        }

        // Increment count
        entry.count++
        this.store.set(key, entry)

        return {
            allowed: true,
            remaining: limitValue - entry.count,
            resetAt: entry.resetAt
        }
    }

    /**
     * Clean expired entries
     */
    cleanExpired(): void {
        const now = Date.now()
        for (const [key, entry] of this.store.entries()) {
            if (entry.resetAt < now) {
                this.store.delete(key)
            }
        }
    }
}

// Export singleton instances for different rate limits
export const apiRateLimiter = new RateLimiter(10, 60 * 1000) // 10 requests per minute
export const aiRateLimiter = new RateLimiter(5, 60 * 1000) // 5 AI requests per minute (more restrictive)

// Clean expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        apiRateLimiter.cleanExpired()
        aiRateLimiter.cleanExpired()
    }, 5 * 60 * 1000)
}

/**
 * Rate limit middleware helper
 */
export async function rateLimit(
    req: Request,
    limiter: RateLimiter = apiRateLimiter,
    limit?: number,
    windowMs?: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number } | null> {
    try {
        const identifier = limiter['getIdentifier'](req)
        return await limiter.check(identifier, limit, windowMs)
    } catch (error) {
        console.error('Rate limit error:', error)
        // Fail open - allow request if rate limiting fails
        return null
    }
}
