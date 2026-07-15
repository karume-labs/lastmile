# Project Context: Last Mile Monorepo

**Project Overview:**
We are building the "Last Mile" platform, consisting of a web dashboard for administrators, a React Native (Expo) mobile app for staff, and a USSD interface for participants. 

**Core Tech Stack:**
- **Package Manager / Runtime:** Bun
- **Frontend (Web):** Next.js (App Router), React, TypeScript
- **Frontend (Mobile):** React Native, Expo
- **Styling & UI:** Tailwind CSS, shadcn/ui (Web), React Native Reusables (Mobile)
- **Backend API:** Node.js, Express
- **Authentication:** Better Auth
- **Database & ORM:** SQLite / LibSQL via Drizzle ORM
- **Validation:** Zod

**Monorepo Architecture:**
The codebase is structured as a Bun workspaces monorepo:
- `apps/admin-web/`: The Next.js admin frontend.
- `apps/staff-mobile/`: The Expo React Native application for staff.
- `apps/participant-ussd/`: USSD interface.
- `apps/api/`: The Express backend exposing endpoints.
- `packages/db/`: The Single Source of Truth (SST) for database connections and Drizzle schemas.
- `packages/auth/`: Better Auth configurations and exported clients.
- `packages/validators/`: Zod schemas for shared cross-boundary validation.
- `packages/types/`: Shared TypeScript types.
