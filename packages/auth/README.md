## `@lastmile/auth`

Shared authentication library for the LastMile system, powered by Better Auth.

## Overview

This package provides authentication configuration and helpers used by the admin web UI and the API backend. It centralizes session handling, token creation/verification, and environment validation.

It relies on `@lastmile/db` for user/session persistence and exposes both server and client helpers to keep auth logic consistent across apps.

## Features

- Better Auth integration with standardized settings
- Drizzle adapter for user and session persistence
- Admin role support and RBAC helpers
- Cross-platform trusted-origins (web & Expo)

## Key Files

- [src/index.ts](src/index.ts): Main server-side auth instance and helpers
- [src/client.ts](src/client.ts): Client-side auth client (`authClient`) for sign-in/out flows
- [src/env.ts](src/env.ts): Zod schema for validating package environment variables

## Usage

Server-side (Express/Next.js API routes): import and use the `auth` instance for session checks and middleware.

Client-side (React/Next.js): use `authClient` to perform sign-in, sign-out, and session refresh operations.

Example server snippet

```ts
import { auth } from "@lastmile/auth";

// Retrieve session for a request
const session = await auth.api.getSession({ headers });
```

Example client snippet

```ts
import { authClient } from "@lastmile/auth/client";

await authClient.signIn.email({ email: "admin@sapcone.org", password: "password123" });
```

## Environment Variables

The package validates required variables via Zod. Commonly used variables:

- `NEXT_PUBLIC_APP_URL` — admin web URL used as base/trusted origin
- `EXPO_PUBLIC_APP_URL` — Expo mobile app URL used as trusted origin
- `NODE_ENV` — `development` or `production`

## Development

- Use the monorepo's package manager (see root `package.json`) to bootstrap.
- Run build/test tasks scoped to this package with your workspace tool (pnpm/bun/npm).

## Notes

- When changing public types, update `packages/types` accordingly to avoid type mismatches across apps.
- Keep auth middleware backward-compatible where possible.

