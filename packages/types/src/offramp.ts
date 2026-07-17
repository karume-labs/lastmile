import type { OfframpSimulateRequestSchema } from "@lastmile/validators/offramp";
import type { z } from "zod/v4";

// ── API Request / Response ──

export type OfframpSimulateRequest = z.infer<typeof OfframpSimulateRequestSchema>;

export type OfframpSimulateResponse = {
  success: boolean;
  fiatAmount: number;
  currency: string;
  providerReference: string;
};
