import { z } from "zod/v4";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  EXPO_PUBLIC_APP_URL: z.url().default("http://localhost:8081"),
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid auth environment variables:", z.prettifyError(_env.error));
  throw new Error("Invalid auth environment variables");
}

export const env = _env.data;
