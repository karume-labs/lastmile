import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.string().default("8000"),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
  // Optional: comma-separated list of extra CORS origins (e.g. LAN IP access)
  CORS_ORIGINS: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AT_USERNAME: z.string().default("sandbox"),
  AT_API_KEY: z.string().min(1, "AT_API_KEY is required"),
  STELLAR_TREASURY_SECRET: z.string().min(56, "Must be a valid secret key").default("S_DUMMY_SECRET_KEY"),
  SOROBAN_CONTRACT_ID: z.string().min(56, "Must be a valid contract ID").default("C_DUMMY_CONTRACT_ID"),
  STELLAR_NETWORK: z.enum(["testnet", "public"]).default("testnet"),
  STELLAR_RPC_URL: z.string().default("https://soroban-testnet.stellar.org:443"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid API environment variables:", z.prettifyError(_env.error));
  throw new Error("Invalid API environment variables");
}

export const env = _env.data;
