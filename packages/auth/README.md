# `@lastmile/auth`

Shared authentication library for the LastMile system, powered by **Better Auth**.

## Overview

This package encapsulates the authentication configuration, server-side instance, and client-side integration helpers used across both the Next.js admin dashboard and the Express API backend.

It is backed by SQLite via `@lastmile/db` and utilizes the Drizzle Adapter for session and user storage.

## Features

- **Better Auth Integration**: Standardizes authentication settings.
- **Drizzle Adapter**: Automatically syncs user and session tables to the database.
- **Admin Plugin**: Built-in support for administrative role-based access control.
- **Cross-Platform Support**: Configured with trusted origins for both web (`NEXT_PUBLIC_APP_URL`) and Expo mobile app (`EXPO_PUBLIC_APP_URL` / `exp://` protocols).

## Key Files

- [src/index.ts](file:///c:/Users/brend/Documents/PROJECTS/lastmile/packages/auth/src/index.ts): Main authentication server instance configuration.
- [src/client.ts](file:///c:/Users/brend/Documents/PROJECTS/lastmile/packages/auth/src/client.ts): Client-side React authentication client setup (`authClient`).
- [src/env.ts](file:///c:/Users/brend/Documents/PROJECTS/lastmile/packages/auth/src/env.ts): Zod schema for validating auth-related environment variables.

## Usage

### Server-Side (e.g. Express API or Next.js API Routes)

```typescript
import { auth } from "@lastmile/auth";

// Example: Retrieve session
const session = await auth.api.getSession({ headers });
```

### Client-Side (React/Next.js)

```typescript
import { authClient } from "@lastmile/auth/client";

// Example: Register user or Sign In
await authClient.signIn.email({
  email: "admin@sapcone.org",
  password: "password123",
});
```

## Environment Variables

The package requires the following environment variables (which are validated via Zod at runtime):
- `NEXT_PUBLIC_APP_URL`: The URL of the Next.js admin interface (used as `baseURL` and in trusted origins).
- `EXPO_PUBLIC_APP_URL`: The URL of the Expo React Native app (used in trusted origins).
- `NODE_ENV`: Runs in `development` or `production` mode to determine cookie safety settings.
