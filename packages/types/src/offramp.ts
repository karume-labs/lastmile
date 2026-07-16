import type { z } from "zod";
import type { OfframpSimulateRequestSchema } from "@lastmile/validators/offramp";

// ── API Request / Response ──

export type OfframpSimulateRequest = z.infer<typeof OfframpSimulateRequestSchema>;

export type OfframpSimulateResponse = {
  success: boolean;
  fiatAmount: number;
  currency: string;
  providerReference: string;
};
