import { env } from "@lastmile/auth/env";
import { db } from "@lastmile/db/client";
import * as schema from "@lastmile/db/schemas/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...schema,
    },
  }),
  baseURL: env.NEXT_PUBLIC_APP_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 365, // 1 year
    updateAge: 60 * 60 * 24 * 365, // Do not spam database with session expiry updates
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL,
    env.EXPO_PUBLIC_APP_URL,
    "exp://",
    // Support extra origins from comma-separated CORS_ORIGINS env var (e.g. LAN IP)
    ...(process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
      : []),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      secure: env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    },
  },
  plugins: [admin()],
});

export type Auth = typeof auth;
