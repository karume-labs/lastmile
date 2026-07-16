# LastMile

A secure, offline-first delivery layer for humanitarian cash assistance. LastMile bridges the gap between digital aid disbursement and physical cash handover for digitally excluded communities — no smartphones or internet required for end beneficiaries.

## How It Works

1. **Field staff** register beneficiaries offline using a React Native mobile app.
2. When funds are disbursed, an **SMS with a secure OTP** is sent to a trusted proxy's feature phone.
3. The beneficiary uses a **USSD menu** on any phone to authorize the transaction.
4. A **Soroban smart contract** on Stellar converts digital aid (USDC) into local mobile money for cash withdrawal.

This provides secure, verifiable, transparent cash handovers with mathematical proof-of-delivery for donors.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime / Package Manager | [Bun](https://bun.sh) (workspaces) |
| Web Dashboard | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui |
| Mobile App | React Native 0.85, Expo 56, NativeWind 4, Expo Router |
| Backend API | Express 4, TypeScript, Helmet |
| Authentication | [Better Auth](https://better-auth.com) |
| Database | LibSQL via [Drizzle ORM](https://orm.drizzle.team) |
| Validation | [Zod](https://zod.dev) |
| Linting / Formatting | [Biome](https://biomejs.dev) |
| Smart Contracts | Soroban (Stellar) — Rust |
| Git Hooks | [Lefthook](https://github.com/evilmartians/lefthook) |

## Project Structure

```
lastmile/
├── apps/
│   ├── admin-web/        # Next.js admin dashboard
│   ├── api/              # Express REST API
│   ├── staff-mobile/     # Expo React Native mobile app
│   ├── contract/         # Soroban smart contract (placeholder)
│   ├── contracts/        # Additional contracts (placeholder)
│   └── participant-channels/ # Participant channel interface
├── packages/
│   ├── auth/             # Better Auth config, handler, and React client
│   ├── db/               # Drizzle schemas and LibSQL client
│   ├── types/            # Shared TypeScript types
│   └── validators/       # Shared Zod validation schemas
├── biome.json            # Linter/formatter config
├── lefthook.yml          # Git pre-commit hooks
├── tsconfig.json         # Root TypeScript config with path aliases
└── package.json          # Workspace root
```

## Prerequisites

- [Bun](https://bun.sh) v1.2+ (`curl -fsSL https://bun.sh/install | bash`)
- [Node.js](https://nodejs.org) v20+ (for compatibility)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for mobile development)
- [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/) (for mobile emulators)

## Setup

### 1. Clone and install

```bash
git clone <repository-url>
cd lastmile
bun install
```

### 2. Environment variables

Each package validates its environment using Zod. Create `.env` files in the relevant directories:

**Root `.env`** (optional — used by the DB package):

```env
DATABASE_URL=file:./local.db
DATABASE_AUTH_TOKEN=          # Only needed for remote LibSQL/Turso
```

**`apps/api/.env`:**

```env
PORT=8000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
DATABASE_URL=file:../../local.db
```

**`apps/admin-web/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**`apps/staff-mobile/.env`:**

```env
EXPO_PUBLIC_API_URL=http://localhost:8001/api
```

### 3. Initialize the database

```bash
# Generate Drizzle client from schemas
bun run db:generate

# Push schema to the local SQLite database
bun run db:push

# (Optional) Open Drizzle Studio to inspect data
bun run db:studio
```

### 4. Generate auth schema

```bash
bun run db:generate-auth
```

### 5. Start development servers

```bash
# Run all apps in parallel
bun run dev

# Or run individual apps:
bun run dev:web      # Admin dashboard — http://localhost:3000
bun run dev:mobile   # Staff mobile app — Expo dev server
```

### Mobile development

```bash
# Start on Android emulator
bun run android:mobile

# Start on iOS simulator
bun run ios:mobile
```

## Available Scripts

### Root scripts

| Script | Description |
|---|---|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all apps |
| `bun run dev:web` | Start the admin web dashboard |
| `bun run build:web` | Build the admin web dashboard |
| `bun run dev:mobile` | Start the staff mobile app |
| `bun run build:mobile` | Build the staff mobile app |
| `bun run android:mobile` | Start mobile on Android |
| `bun run ios:mobile` | Start mobile on iOS |
| `bun run db:generate` | Generate Drizzle client |
| `bun run db:push` | Push schema to database |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:seed` | Seed the database |
| `bun run db:generate-auth` | Generate Better Auth schema |
| `bun run typecheck` | Run typecheck across all packages |
| `bun run ui:web` | Add shadcn/ui components to admin-web |
| `bun run ui:mobile` | Add React Native Reusables to staff-mobile |
| `bun run mobile:doctor` | Run Expo doctor for the mobile app |
| `bun run mobile:install:check` | Check Expo dependencies |
| `bun run mobile:install:fix` | Fix Expo dependencies |
| `bun run mobile:upgrade` | Upgrade Expo version |
| `bun run reinstall` | Clean node_modules and reinstall all dependencies |

### Per-app scripts

**admin-web:**
```bash
bun --cwd apps/admin-web dev      # Next.js dev server
bun --cwd apps/admin-web build    # Production build
bun --cwd apps/admin-web lint     # Biome check
bun --cwd apps/admin-web format   # Biome format
```

**staff-mobile:**
```bash
bun --cwd apps/staff-mobile dev      # Expo dev server
bun --cwd apps/staff-mobile android  # Start on Android
bun --cwd apps/staff-mobile ios      # Start on iOS
```

**api:**
```bash
bun --cwd apps/api dev    # Express dev server with --watch
```

## Apps

### admin-web

Next.js 16 admin dashboard for managing aid programmes and monitoring deliveries.

| Route | Description |
|---|---|
| `/sign-in` | Email/password authentication |
| `/admin/dashboard` | Metrics overview — disbursements, active deliveries, stagnant funds, proxies |
| `/admin/deliveries` | Delivery tracker with status filtering |
| `/admin/programmes` | Programme and batch management |
| `/admin/stagnant-funds` | Stagnant funds alerts and clawback authorization |
| `/admin/audits` | Audit log of administrative and system events |
| `/admin/proxies` | Proxy agent management |

**Stack:** Next.js App Router, React Query, React Hook Form, TanStack React Table, Axios, shadcn/ui, Sonner toasts.

### staff-mobile

Expo React Native app for field staff to register beneficiaries offline and sync when online.

| Screen | Description |
|---|---|
| `(auth)/login` | Email/password login |
| `(tabs)/` | Dashboard — connection status, pending queue count, quick actions |
| `(tabs)/intake` | Beneficiary registration form with offline queue |
| `(tabs)/queue` | Offline queue management with sync |
| `(tabs)/settings` | Account info and sign-out |

**Key features:** Offline-first registration with AsyncStorage, automatic sync queue, network detection, auto-generated reference IDs (`LM-...`).

### api

Express REST API backend with modular route handlers for authentication, registration, programme management, delivery tracking, USSD gateway, and Stellar blockchain integration.

**Note:** Many feature modules are currently stubbed out. The server boots with auth, CORS, helmet, and health check endpoints.

## Packages

| Package | Path | Description |
|---|---|---|
| `@lastmile/auth` | `packages/auth` | Better Auth server instance, handler, and React client |
| `@lastmile/db` | `packages/db` | LibSQL/Drizzle client, schemas, and connection factory |
| `@lastmile/types` | `packages/types` | Shared TypeScript type definitions |
| `@lastmile/validators` | `packages/validators` | Shared Zod validation schemas |

### Dependency graph

```
admin-web ─────┬──> @lastmile/types
               └──> @lastmile/validators

staff-mobile ──┬──> @lastmile/types
               └──> @lastmile/validators

api ───────────┬──> @lastmile/auth ──> @lastmile/db
               ├──> @lastmile/db
               ├──> @lastmile/validators
               └──> @lastmile/types
```

## Code Quality

### Linting and formatting

```bash
# Check all files
bunx @biomejs/biome check .

# Auto-fix
bunx @biomejs/biome check --write .
```

Biome is configured with 2-space indentation, 100-character line width, and organized imports. UI component directories (`components/ui/**`) and `globals.css` are excluded from linting/formatting.

### Type checking

```bash
bun run typecheck
```

### Git hooks

[Lefthook](https://github.com/evilmartians/lefthook) runs pre-commit hooks automatically:
- **Lint:** Biome check on staged `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.jsonc` files
- **Typecheck:** Full typecheck across all packages

### Coding conventions

- Arrow functions only (no `function` keyword)
- Named exports preferred (default exports only for single-export files)
- Props typed with `interface`; components typed with `React.FC<Props>`
- Server Components by default in Next.js (no `"use client"` in page files)
- Prefer React Hook Form, TanStack Query, TanStack Table over raw `useState`/`useEffect`
- Tailwind theme tokens only — no hardcoded colors or arbitrary values
- shadcn/ui components only for the web app
- Absolute imports via `@lastmile/*` path aliases
- Zod-validated environment objects — never read `process.env` directly

## Environment Variables Reference

| Variable | Default | Used By | Description |
|---|---|---|---|
| `DATABASE_URL` | `file:./local.db` | `@lastmile/db` | LibSQL database URL |
| `DATABASE_AUTH_TOKEN` | — | `@lastmile/db` | Auth token for remote LibSQL/Turso |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `@lastmile/auth` | Web app base URL |
| `EXPO_PUBLIC_APP_URL` | `http://localhost:8081` | `@lastmile/auth` | Mobile app base URL |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | `admin-web` | API base URL for web frontend |
| `EXPO_PUBLIC_API_URL` | `http://localhost:8001/api` | `staff-mobile` | API base URL for mobile app |
| `PORT` | `8000` (api) / `3000` (auth) | `api`, `auth` | Server port |
| `FRONTEND_URL` | `http://localhost:3000` | `api` | CORS allowed origin |
| `NODE_ENV` | `development` | `api`, `auth` | Environment mode |

## License

Private — not for public distribution.
