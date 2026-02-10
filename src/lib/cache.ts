// Simple in-memory cache with TTL and request deduplication
interface CacheEntry<T> {
    data: T
    expiresAt: number
}

interface PendingRequest<T> {
    promise: Promise<T>
    resolve: (value: T) => void
    reject: (error: Error) => void
}

class SimpleCache {
    private cache = new Map<string, CacheEntry<unknown>>()
    private pendingRequests = new Map<string, PendingRequest<unknown>>()
    private defaultTTL = 60 * 60 * 1000 // 1 hour in milliseconds

    /**
     * Generate cache key from topic and context
     */
    generateKey(topic: string, context?: string): string {
        const hash = this.simpleHash(`${topic}:${context || ''}`)
        return `cache:${hash}`
    }

    /**
     * Simple hash function for cache keys
     */
    private simpleHash(str: string): string {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36)
    }

    /**
     * Get cached value or execute fetcher with deduplication
     */
    async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = this.defaultTTL
    ): Promise<T> {
        // Check cache first
        const cached = this.cache.get(key) as CacheEntry<T> | undefined
        if (cached && cached.expiresAt > Date.now()) {
            return cached.data
        }

        // Check if there's already a pending request for this key
        const pending = this.pendingRequests.get(key) as PendingRequest<T> | undefined
        if (pending) {
            return pending.promise as Promise<T>
        }

        // Create new request
        let resolve: (value: T) => void
        let reject: (error: Error) => void
        const promise = new Promise<T>((res, rej) => {
            resolve = res
            reject = rej
        })

        this.pendingRequests.set(key, { promise, resolve: resolve! as unknown as (value: unknown) => void, reject: reject! })

        try {
            const data = await fetcher()

            // Cache the result
            this.cache.set(key, {
                data,
                expiresAt: Date.now() + ttl
            })

            // Resolve all pending requests
            resolve!(data)
            this.pendingRequests.delete(key)

            return data
        } catch (error) {
            // Reject all pending requests
            reject!(error as Error)
            this.pendingRequests.delete(key)
            throw error
        }
    }

    /**
     * Clear cache entry
     */
    clear(key: string): void {
        this.cache.delete(key)
    }

    /**
     * Clear all cache
     */
    clearAll(): void {
        this.cache.clear()
    }

    /**
     * Clean expired entries
     */
    cleanExpired(): void {
        const now = Date.now()
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expiresAt <= now) {
                this.cache.delete(key)
            }
        }
    }
}

// Export singleton instance
export const cache = new SimpleCache()

// Clean expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        cache.cleanExpired()
    }, 5 * 60 * 1000)
}
