# Project Context: Last Mile Monorepo

**Project Overview & Mission:**
We are building "LastMile," a secure, offline-first delivery layer for humanitarian cash assistance. It is designed to serve digitally excluded communities in remote areas (such as Turkana County, Kenya) who lack smartphones and consistent internet access.

* **The Challenge:** Delivering aid to nomadic pastoralist communities often relies on risky manual cash transport or unverifiable "proxy" handovers, where a trusted community member with a basic feature phone receives funds on behalf of a beneficiary. This creates gaps in accountability and security.
* **The Solution:** LastMile acts as a human-digital bridge. Field staff use an offline-capable mobile app to register beneficiaries. When funds are disbursed, the system utilizes a trust-based proxy model: an SMS notification (containing a secure OTP) is sent to the proxy's feature phone. The beneficiary then uses a simple USSD menu on that phone to authorize the transaction, which automatically triggers a smart contract to convert digital aid (USDC) into local mobile money for immediate cash withdrawal.
* **The Impact:** The platform ensures secure, verifiable, and transparent cash handovers. It upholds the dignity and privacy of participants while giving donor organizations mathematically proven accountability—all without requiring the end-user to own a smartphone or understand blockchain technology.

**System Components:**
To achieve this, the platform consists of three main user-facing applications:

* A web dashboard for administrators to approve batches, monitor deliveries, and authorize clawbacks for stagnant funds.
* A React Native (Expo) mobile app for field staff to register participants offline.
* A USSD interface for participants to authenticate sessions and access their funds.

**Core Tech Stack:**

* **Package Manager / Runtime:** Bun
* **Frontend (Web):** Next.js (App Router), React, TypeScript
* **Frontend (Mobile):** React Native, Expo
* **Styling & UI:** Tailwind CSS, shadcn/ui (Web), React Native Reusables (Mobile)
* **Backend API:** Node.js, Express
* **Authentication:** Better Auth
* **Database & ORM:** SQLite / LibSQL via Drizzle ORM
* **Validation:** Zod

**Monorepo Architecture:**
The codebase is structured as a Bun workspaces monorepo to enforce end-to-end type safety and strict domain isolation:

* `apps/admin-web/`: The Next.js admin frontend.
* `apps/staff-mobile/`: The Expo React Native application for staff.
* `apps/participant-ussd/`: USSD interface simulator/handler.
* `apps/api/`: The Express backend exposing endpoints and handling webhooks.
* `packages/db/`: The Single Source of Truth (SST) for database connections and Drizzle schemas, separated by feature domains (e.g., identity, registration, programmes).
* `packages/auth/`: Better Auth configurations and exported clients.
* `packages/validators/`: Zod schemas for shared cross-boundary validation.
* `packages/types/`: Shared TypeScript types mapped to database schemas and validators.
