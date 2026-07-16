import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { disbursements } from "@lastmile/db/schemas/programmes";

// ── Base Drizzle-derived schemas ──

export const DisbursementInsertSchema = createInsertSchema(disbursements);
export const DisbursementSelectSchema = createSelectSchema(disbursements);

// ── Disbursement Trigger ──
// Validates POST /api/programmes/disburse — initiates a USDC payout
// for a given registration reference.

export const DisbursementTriggerRequestSchema = z.object({
  referenceId: z.string().min(1),
  amountUsdc: z.number().positive().max(10_000),
});

// ── Clawback Execute ──
// Validates POST /api/admin/clawback/execute — triggers the Soroban
// Relayer to reverse a stagnant disbursement on-chain.

export const ClawbackRequestSchema = z.object({
  paymentId: z.string().uuid(),
});

// ── Stagnant Funds Query ──
// Validates GET /api/admin/stagnant-funds query params.

export const StagnantFundsQuerySchema = z.object({
  daysPending: z.coerce.number().int().positive().default(7),
});
