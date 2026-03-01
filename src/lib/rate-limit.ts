

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

    private getIdentifier(req: Request): string {
        
        const forwarded = req.headers.get('x-forwarded-for')
        const realIp = req.headers.get('x-real-ip')
        const ip = forwarded?.split(',')[0] || realIp || 'unknown'
        
        return ip
    }

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

        entry.count++
        this.store.set(key, entry)

        return {
            allowed: true,
            remaining: limitValue - entry.count,
            resetAt: entry.resetAt
        }
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

export const apiRateLimiter = new RateLimiter(10, 60 * 1000) 
export const aiRateLimiter = new RateLimiter(5, 60 * 1000) 

if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        apiRateLimiter.cleanExpired()
        aiRateLimiter.cleanExpired()
    }, 5 * 60 * 1000)
}

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
        
        return null
    }
}
