# syntax=docker/dockerfile:1.7

# 1. Base image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl

# 2. Full dependencies. Used by the Next.js builder and the worker bundler.
# Final runtime stages (runner + worker) install slim node_modules separately.
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build-time placeholders so env validation in lib/env.ts passes during `next build`.
# These are never used at runtime — the runner stage doesn't carry them, and the
# real values come from the compose `environment:` block.
ENV AUTH_SECRET="build-only-placeholder"
ENV OPENROUTER_API_KEY="build-only-placeholder"
ENV DATABASE_URL=""

RUN npm run build

# 4. Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD curl -fsS http://localhost:3000/api/health || curl -fsS http://localhost:3000/ || exit 1

CMD ["node", "server.js"]

# 5. Worker bundle stage: uses esbuild to compile worker + lib code into one
# JS file with only a handful of native modules left external.
FROM base AS worker-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
COPY worker ./worker
RUN node worker/build.mjs

# 6. Worker runtime: only the bundle + the 4 external modules.
FROM base AS worker
WORKDIR /app
ENV NODE_ENV=production

# Minimal node_modules: bullmq, ioredis, openai, dotenv.
COPY worker/package.json ./package.json
RUN npm install --omit=dev --omit=optional --no-audit --no-fund

COPY --from=worker-builder /app/dist/worker.cjs ./worker.cjs

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && chown -R nextjs:nodejs /app

USER nextjs

CMD ["node", "worker.cjs"]

# 7. Migration runner: a one-shot image that applies pending Drizzle SQL
# migrations against the live Postgres. Uses the `deps` node_modules so it
# has drizzle-orm + postgres available.
FROM base AS migrator
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY drizzle ./drizzle
COPY scripts/migrate.mjs ./migrate.mjs

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && chown -R nextjs:nodejs /app

USER nextjs

CMD ["node", "migrate.mjs"]
