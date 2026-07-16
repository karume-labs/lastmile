import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.string().default("8000"),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid API environment variables:", _env.error.format());
  throw new Error("Invalid API environment variables");
}

export const env = _env.data;
