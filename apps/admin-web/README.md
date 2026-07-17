# apps/admin-web

Admin web application (Next.js) for Lastmile.

Overview

- Next.js app used by administrators to manage programmes, deliveries, and user accounts.
- Uses React, Tailwind/CSS, and the shared `@lastmile/auth`, `@lastmile/types`, and API client libraries.

Getting started

- Install dependencies via the monorepo manager.
- Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_APP_URL`, API URL, and auth-related env vars.

Development

- Run the app in dev mode with the workspace script that targets `apps/admin-web`.
- Hot reload is enabled by Next.js. Use `src/app` for route and layout changes.

Build

- Use the root build scripts or run Next.js build in the app folder.

Deployment

- Deploy via Vercel, Netlify, or your chosen host. Ensure environment variables are set appropriately.

Notes

- See `src/env.ts` for validated runtime environment variables.
