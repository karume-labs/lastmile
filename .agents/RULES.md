# Coding Guidelines & Rules

## React & Component Guidelines
- **Arrow Functions Only:** Strictly use arrow functions (`const Foo = () => {...}`) for all function definitions across the codebase, including React components, utility functions, and API handlers. Do not use the `function` keyword.
- **Exports:** Use `export default` ONLY if it is the single thing being exported from the file (like Next.js pages or configs); otherwise, use named exports.
- **Props:** Use `interface` specifically for prop types, and type components using `React.FC<Props>`. Do not type the component with `React.FC` if it does not have props.
- **Client Components:** Do NOT use the `"use client"` directive inside any Next.js `page.tsx` file. Keep pages as Server Components and extract interactive pieces into separate client components.

## Styling & Theme
- **Theming:** Strictly use existing Tailwind CSS theme tokens (e.g., `bg-background`, `text-muted-foreground`). 
- **No Hardcoded Colors:** Do not use hardcoded colors or arbitrary square bracket values (e.g., `text-[#ff0000]`) anywhere.
- **Shadcn/UI First:** Do not write raw HTML elements (like `<button class="...">` or `<input>`). You must default to the corresponding `shadcn/ui` (or `react-native-reusables`) component.

## Code Organization & Reusability
- **Imports:** **NEVER use relative imports.** Always use the absolute path aliases configured in the root `tsconfig.json` (e.g., `@lastmile/db/`, `@lastmile/auth/`, `@lastmile/api/`).
- **Feature Folders:** Organize domain logic into feature-based folders (e.g., `src/features/`) rather than flat technical folders.
- **Reusability Check:** Always check for existing reusable functions, utilities, and components before creating a new one to avoid duplication.

## Backend & API
- **Routing:** Use Express routers to modularize endpoints. 
- **Terminology:** Always refer to API "endpoints" as **"urls"** in both code terminology and documentation.
- **Authentication:** All authentication logic goes through the Better Auth client/node-handler.

## Environment Variables
- **Strict Validation:** Environment variables must NEVER be read directly from `process.env`. They must be read from the strictly typed Zod-validated `env` object exported from the local package (e.g., `import { env } from "@lastmile/api/env";`).
- **No Fallbacks:** Do not use `||` or `??` fallbacks when reading env variables in application code. All defaults must be handled directly inside the Zod schema definitions.

## Post-Processing & Quality
- **Type Safety:** Maintain zero TypeScript compilation errors.
- **Lint & Format:** Always run Biome checking/formatting when you are done modifying files, and proactively fix any resulting errors.
- **No Biome Ignores:** It is strictly banned to silence Biome warnings and errors using `// biome-ignore` comments.
- **No Deprecated Code:** Never use deprecated code from libraries.
