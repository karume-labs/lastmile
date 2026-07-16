import { phoneNumberSchema } from "@lastmile/validators/shared";
import { z } from "zod";

// ── USSD Session Request ──
// Validates the incoming Africa's Talking webhook payload.
// The `text` field contains the user's star-code input, e.g. "SAP-9942*849201".

export const UssdSessionRequestSchema = z.object({
  sessionId: z.string().min(1),
  phoneNumber: phoneNumberSchema,
  text: z.string().min(1),
});
