interface CacheEntry<T> {
    data: T
    expiresAt: number
}

class SimpleCache {
    private cache = new Map<string, CacheEntry<unknown>>()
    private pendingRequests = new Map<string, Promise<unknown>>()
    private defaultTTL = 60 * 60 * 1000

    generateKey(namespace: string, payload?: unknown): string {
        const hash = this.simpleHash(`${namespace}:${this.serialize(payload)}`)
        return `cache:${hash}`
    }

    private serialize(value: unknown): string {
        if (value == null) {
            return ""
        }

        if (typeof value === "string") {
            return value.trim().replace(/\s+/g, " ").toLowerCase()
        }

        if (typeof value === "number" || typeof value === "boolean") {
            return String(value)
        }

        if (Array.isArray(value)) {
            return `[${value.map((item) => this.serialize(item)).join(",")}]`
        }

        if (typeof value === "object") {
            const entries = Object.entries(value as Record<string, unknown>)
                .filter(([, nestedValue]) => nestedValue !== undefined)
                .sort(([left], [right]) => left.localeCompare(right))

            return `{${entries
                .map(([key, nestedValue]) => `${key}:${this.serialize(nestedValue)}`)
                .join(",")}}`
        }

        return String(value)
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

    get<T>(key: string): T | null {
        const cached = this.cache.get(key) as CacheEntry<T> | undefined
        if (!cached) {
            return null
        }

        if (cached.expiresAt <= Date.now()) {
            this.cache.delete(key)
            return null
        }

        return cached.data
    }

    set<T>(key: string, data: T, ttl: number = this.defaultTTL): T {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttl,
        })

        return data
    }

    async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = this.defaultTTL
    ): Promise<T> {
        const cached = this.get<T>(key)
        if (cached !== null) {
            return cached
        }

        const pending = this.pendingRequests.get(key) as Promise<T> | undefined
        if (pending) {
            return pending
        }

        const promise = fetcher()
            .then((data) => this.set(key, data, ttl))
            .finally(() => {
                this.pendingRequests.delete(key)
            })

        this.pendingRequests.set(key, promise as Promise<unknown>)

        try {
            return await promise
        } catch (error) {
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
