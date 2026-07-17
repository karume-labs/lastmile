import type { UssdSessionRequestSchema } from "@lastmile/validators/channels";
import type { z } from "zod/v4";

// ── API Request / Response ──

export type UssdSessionRequest = z.infer<typeof UssdSessionRequestSchema>;

export type UssdSessionResponse = {
  sessionId: string;
  response: string;
};

export type channelParams = {
  phoneNumber: string;
  text: string;
};
