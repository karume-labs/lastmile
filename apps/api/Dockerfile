FROM oven/bun:1-alpine AS base
WORKDIR /app

# ── Dependency stage ──────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json bun.lock ./

# Copy package.jsons for workspace resolution
COPY apps/api/package.json ./apps/api/
COPY apps/admin-web/package.json ./apps/admin-web/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/validators/package.json ./packages/validators/
COPY packages/auth/package.json ./packages/auth/

RUN bun install --ignore-scripts

# ── Runner stage ──────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy installed dependencies and workspace structure from deps stage
COPY --from=deps /app ./

# Copy the rest of the application code
COPY . .

# Copy and make the entrypoint script executable
COPY apps/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the API port
EXPOSE 8000
ENV PORT=8000

# On container start:
#   1. Run DB migrations  (drizzle-kit migrate)
#   2. Force-seed the DB  (bun run src/seed/index.ts -F)
#   3. Start the API      (bun run start)
ENTRYPOINT ["/entrypoint.sh"]
