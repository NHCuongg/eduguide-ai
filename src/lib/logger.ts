import pino, { type Logger } from "pino"

// Single shared logger. Pretty in dev, JSON lines in prod (so docker logs +
// any log aggregator can parse without extra config).
const isProd = process.env.NODE_ENV === "production"

export const logger: Logger = pino({
    level: process.env.LOG_LEVEL ?? (isProd ? "info" : "debug"),
    base: {
        service: process.env.SERVICE_NAME ?? "pet-manager",
        env: process.env.NODE_ENV ?? "development",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "headers.authorization",
            "headers.cookie",
            "*.password",
            "*.token",
            "AUTH_SECRET",
            "OPENROUTER_API_KEY",
        ],
        censor: "[REDACTED]",
    },
})

/**
 * Helper to create a child logger scoped to a feature/module so log lines
 * carry the namespace automatically.
 */
export function child(namespace: string): Logger {
    return logger.child({ ns: namespace })
}
