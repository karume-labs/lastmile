# packages/db

Database utilities and Drizzle configuration used across the monorepo.

Overview

- Provides a central database client configured for SQLite/Postgres depending on environment.
- Exposes migration helpers and schema definitions used by services.

Key files

- `src/client.ts` — DB client and connection helper
- `drizzle.config.ts` — Drizzle configuration and migration settings

Usage

- Import the DB client to run queries and access transaction helpers.
- Run migrations via the monorepo scripts that invoke Drizzle CLI.

Development

- Ensure environment variables for DB connection are set (see app-specific `env.ts`).
- Run package-scoped build and tests via the repository manager.

Notes

- Keep schema changes coordinated with `packages/types` to maintain type compatibility.
