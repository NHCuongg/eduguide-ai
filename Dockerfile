# syntax=docker/dockerfile:1.7

# 1. Base image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl

# 2. Dependencies
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

# Build-time env vars (optional). Real secrets are injected at runtime via the runner.
ARG DATABASE_URL=""
ARG AUTH_SECRET="build-time-placeholder-secret-ignored-at-runtime"
ARG OPENROUTER_API_KEY="build-time-placeholder-key-ignored-at-runtime"
ENV DATABASE_URL=${DATABASE_URL}
ENV AUTH_SECRET=${AUTH_SECRET}
ENV OPENROUTER_API_KEY=${OPENROUTER_API_KEY}

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
