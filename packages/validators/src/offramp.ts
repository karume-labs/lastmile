import { z } from "zod/v4";

// ── Off-Ramp Simulate Request ──
// Validates POST /api/offramp/simulate — converts USDC to fiat
// and simulates an M-Pesa deposit.

export const OfframpSimulateRequestSchema = z.object({
  referenceId: z.string().min(1),
  amountUsdc: z.number().positive().max(10_000),
});
