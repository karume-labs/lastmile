import type { UssdSessionRequestSchema } from "@lastmile/validators/ussd";
import type { z } from "zod/v4";

// ── API Request / Response ──

export type UssdSessionRequest = z.infer<typeof UssdSessionRequestSchema>;

export type UssdSessionResponse = {
  sessionId: string;
  response: string;
};

export type ussdParams = {
  phoneNumber: string;
  text: string;
};
