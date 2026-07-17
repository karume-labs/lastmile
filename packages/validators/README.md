# packages/validators

Validation utilities and Zod schemas shared across services and apps.

Overview

- Contains Zod schemas for request validation and shared shape validators used in API and client code.

Key files

- `src/*.ts` — schema files for `auth`, `registration`, `programmes`, `sms`, etc.

Usage

- Import specific schemas to validate request bodies or to parse data from external sources.

Development

- Keep schemas in sync with `packages/types` when shapes change.
- Add unit tests for new validators to prevent regressions.
