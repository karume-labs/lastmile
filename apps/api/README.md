# apps/api

Express / Fastify API backend for Lastmile.

Overview

- Provides REST endpoints and background workers used by apps and services.
- Integrates with `@lastmile/db`, `@lastmile/auth`, and other shared packages.

Getting started

- Set environment variables (see `src/env.ts`) including DB connection and auth settings.
- Install dependencies via the repository package manager.

Development

- Run the API locally with the workspace dev script that targets `apps/api`.
- Logs are available via `src/lib/logger.ts` and middlewares provide structured errors and request audit logs.

Testing & Migrations

- Use the monorepo migration helpers to run Drizzle migrations.
- Run unit and integration tests scoped to the API package.

Deployment

- The API can be deployed to Node hosts or containerized with Docker. Ensure secrets and DB connections are configured.

Notes

- Keep API contract changes synchronized with `packages/types`.

