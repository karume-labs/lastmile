import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.string().default("8000"),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
  // Optional: comma-separated list of extra CORS origins (e.g. LAN IP access)
  CORS_ORIGINS: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AT_USERNAME: z.string().default("sandbox"),
  AT_API_KEY: z.string().min(1, "AT_API_KEY is required"),
  KOTANI_API_KEY: z.string().min(1, "Kotani API key is required"),
  KOTANI_API_SECRET: z.string().min(1, "Kotani Secret is required"),
  KOTANI_WEBHOOK_SECRET: z.string().optional(),
  STELLAR_TREASURY_SECRET: z.string().min(56, "Treasury secret key must be a valid Stellar seed"),
  USDC_ISSUER_ADDRESS: z.string().default("GBBD47IF6LWK7P7MABDH4YZOW7FCEDPO7R3N67A5UH32625Z5CO2K7OE"),
  SOROBAN_CONTRACT_ID: z.string().min(56, "Soroban Contract ID is required"),
  SOROBAN_TOKEN_ID: z.string().min(56, "Soroban Token ID (USDC) is required"),
  STELLAR_RPC_URL: z.string().default("https://soroban-testnet.stellar.org:443"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid API environment variables:", z.prettifyError(_env.error));
  throw new Error("Invalid API environment variables");
}

export const env = _env.data;
