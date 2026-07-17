# apps/participant-ussd

USSD gateway app for participant-facing flows.

Overview

- Handles incoming USSD session messages and routes them to the `apps/api` backend.
- Integrates with `@lastmile/ussd-client` and shared validators/types.

Getting started

- Configure USSD gateway credentials and endpoints via environment variables in `src/env.ts`.
- Install dependencies and run the dev server via workspace scripts.

Development

- Use the local dev server to simulate USSD requests when possible.

Notes

- Keep USSD menu definitions and handlers synchronized with the API validation schemas.
