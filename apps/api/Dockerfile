FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
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

# Install dependencies
RUN bun install --frozen-lockfile --ignore-scripts

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy installed dependencies and workspace structure from deps stage
COPY --from=deps /app ./

# Copy the rest of the application code
COPY . .

# Set working directory to the API app
WORKDIR /app/apps/api

# Expose the API port
EXPOSE 8000
ENV PORT=8000

# Run the API
CMD ["bun", "run", "start"]
