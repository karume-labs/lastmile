#!/bin/sh
set -e

echo "==> Running database migrations..."
cd /app/packages/db
bun run db:migrate

echo "==> Seeding database (force fresh)..."
bun run src/seed/index.ts -F

echo "==> Starting API server..."
cd /app/apps/api
exec bun run start
