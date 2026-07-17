# packages/types

Shared TypeScript types for the Lastmile monorepo.

Overview

- Centralizes DTOs, API contracts, and domain types used by apps and packages.
- Keeps a single source of truth for type definitions to avoid drift.

Key files

- `src/*.ts` — domain and API types, e.g. `api.ts`, `auth.ts`, `programmes.ts`.

Usage

- Import types from `@lastmile/types` in applications and packages.
- When updating types that affect runtime contracts, coordinate with API clients and consumers.

Development

- Run `tsc` for the package to ensure type correctness.
- Publish or update workspace references when types change.

Notes

- Prefer additive changes to preserve compatibility; communicate breaking changes.
