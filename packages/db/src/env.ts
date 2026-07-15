import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").default("file:../../local.db"),
  DATABASE_AUTH_TOKEN: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid db environment variables:", _env.error.format());
  throw new Error("Invalid db environment variables");
}

export const env = _env.data;
