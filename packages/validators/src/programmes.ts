import { batches, disbursements, programmes } from "@lastmile/db/schemas/programmes";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ── Base Drizzle-derived schemas ──

export const DisbursementInsertSchema = createInsertSchema(disbursements);
export const DisbursementSelectSchema = createSelectSchema(disbursements);

export const ProgrammeInsertSchema = createInsertSchema(programmes);
export const ProgrammeSelectSchema = createSelectSchema(programmes);

export const BatchInsertSchema = createInsertSchema(batches);
export const BatchSelectSchema = createSelectSchema(batches);

// ── Disbursement Trigger ──
// Validates POST /api/programmes/disburse — initiates a USDC payout
// for a given registration reference.

export const DisbursementTriggerRequestSchema = z.object({
  programmeId: z.string().min(1),
});

// ── Clawback Execute ──
// Validates POST /api/admin/clawback/execute — triggers the Soroban
// Relayer to reverse a stagnant disbursement on-chain.

export const ClawbackRequestSchema = z.object({
  paymentId: z.string().min(1),
});

// ── Stagnant Funds Query ──
// Validates GET /api/admin/stagnant-funds query params.

export const StagnantFundsQuerySchema = z.object({
  daysPending: z.coerce.number().int().positive().default(7),
});

// ── Create Batch ──
export const CreateBatchRequestSchema = z.object({
  programmeName: z.string().min(1, "Programme name is required"),
  targetCurrency: z.string().min(1, "Currency is required"),
  batchSize: z.number().min(1, "Batch size must be at least 1"),
});

// ── Bulk Notify ──
export const ProgrammeNotifyRequestSchema = z.object({
  template: z.enum(["3_days_before", "1_day_before", "today"]),
});
