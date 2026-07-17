import { z } from "zod/v4";

const seedEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").default("file:../../local.db"),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  API_URL: z.string().optional(),
  NODE_ENV: z.string().optional().default("development"),
});

type SeedEnv = z.infer<typeof seedEnvSchema>;

let _env: SeedEnv | null = null;

function getOrCreateEnv(): SeedEnv {
  if (!_env) {
    const _parsed = seedEnvSchema.safeParse(process.env);
    if (!_parsed.success) {
      console.error("Invalid seed environment variables:", _parsed.error.format());
      throw new Error("Invalid seed environment variables");
    }
    _env = _parsed.data;
  }
  return _env;
}

export const env = new Proxy({} as SeedEnv, {
  get(_, prop: string) {
    return getOrCreateEnv()[prop as keyof SeedEnv];
  },
}) as SeedEnv;
