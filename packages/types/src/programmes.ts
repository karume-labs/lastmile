import type {
  BatchInsertSchema,
  BatchSelectSchema,
  ClawbackRequestSchema,
  CreateBatchRequestSchema,
  DisbursementInsertSchema,
  DisbursementSelectSchema,
  DisbursementTriggerRequestSchema,
  ProgrammeInsertSchema,
  ProgrammeSelectSchema,
  StagnantFundsQuerySchema,
} from "@lastmile/validators/programmes";
import type { z } from "zod/v4";

// ── Database Models ──

export type Disbursement = z.infer<typeof DisbursementSelectSchema>;
export type InsertDisbursement = z.infer<typeof DisbursementInsertSchema>;

export type Programme = z.infer<typeof ProgrammeSelectSchema>;
export type InsertProgramme = z.infer<typeof ProgrammeInsertSchema>;

export type Batch = z.infer<typeof BatchSelectSchema>;
export type InsertBatch = z.infer<typeof BatchInsertSchema>;

// ── API Request / Response ──

export type DisbursementTriggerRequest = z.infer<typeof DisbursementTriggerRequestSchema>;
export type ClawbackRequest = z.infer<typeof ClawbackRequestSchema>;
export type StagnantFundsQuery = z.infer<typeof StagnantFundsQuerySchema>;
export type CreateBatchRequest = z.infer<typeof CreateBatchRequestSchema>;

export type ClawbackResponse = {
  success: boolean;
  transactionHash: string;
  status: "clawed_back";
};

export type StagnantFundItem = {
  id: string;
  participantName: string;
  referenceId: string;
  programmeName: string;
  amount: string;
  currency: string;
  status: "stagnant" | "clawed-back" | "under-review";
  lastActivityDate: string;
  daysSinceActivity: number;
};
