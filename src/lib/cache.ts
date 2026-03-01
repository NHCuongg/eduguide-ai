
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
    private defaultTTL = 60 * 60 * 1000 

    generateKey(topic: string, context?: string): string {
        const hash = this.simpleHash(`${topic}:${context || ''}`)
        return `cache:${hash}`
    }

    private simpleHash(str: string): string {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash 
        }
        return Math.abs(hash).toString(36)
    }

    async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = this.defaultTTL
    ): Promise<T> {
        
        const cached = this.cache.get(key) as CacheEntry<T> | undefined
        if (cached && cached.expiresAt > Date.now()) {
            return cached.data
        }

        const pending = this.pendingRequests.get(key) as PendingRequest<T> | undefined
        if (pending) {
            return pending.promise as Promise<T>
        }

        let resolve: (value: T) => void
        let reject: (error: Error) => void
        const promise = new Promise<T>((res, rej) => {
            resolve = res
            reject = rej
        })

        this.pendingRequests.set(key, { promise, resolve: resolve! as unknown as (value: unknown) => void, reject: reject! })

        try {
            const data = await fetcher()

            this.cache.set(key, {
                data,
                expiresAt: Date.now() + ttl
            })

            resolve!(data)
            this.pendingRequests.delete(key)

            return data
        } catch (error) {
            
            reject!(error as Error)
            this.pendingRequests.delete(key)
            throw error
        }
    }

    clear(key: string): void {
        this.cache.delete(key)
    }

    clearAll(): void {
        this.cache.clear()
    }

    cleanExpired(): void {
        const now = Date.now()
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expiresAt <= now) {
                this.cache.delete(key)
            }
        }
    }
}

export const cache = new SimpleCache()

if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        cache.cleanExpired()
    }, 5 * 60 * 1000)
}
