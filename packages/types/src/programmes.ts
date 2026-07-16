import type {
  ClawbackRequestSchema,
  DisbursementInsertSchema,
  DisbursementSelectSchema,
  DisbursementTriggerRequestSchema,
  StagnantFundsQuerySchema,
} from "@lastmile/validators/programmes";
import type { z } from "zod";

// ── Database Models ──

export type Disbursement = z.infer<typeof DisbursementSelectSchema>;
export type InsertDisbursement = z.infer<typeof DisbursementInsertSchema>;

// ── API Request / Response ──

export type DisbursementTriggerRequest = z.infer<typeof DisbursementTriggerRequestSchema>;
export type ClawbackRequest = z.infer<typeof ClawbackRequestSchema>;
export type StagnantFundsQuery = z.infer<typeof StagnantFundsQuerySchema>;

export type ClawbackResponse = {
  success: boolean;
  transactionHash: string;
  status: "clawed_back";
};

export type StagnantFundItem = {
  paymentId: string;
  referenceId: string;
  amount: number;
  daysPending: number;
};
