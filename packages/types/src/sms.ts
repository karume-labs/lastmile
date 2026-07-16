import type {
  SmsCreateRequestSchema,
  SmsMessageInsertSchema,
  SmsMessageSelectSchema,
} from "@lastmile/validators/sms";
import type { z } from "zod";

export type SmsMessage = z.infer<typeof SmsMessageSelectSchema>;
export type InsertSmsMessage = z.infer<typeof SmsMessageInsertSchema>;
export type SmsCreateRequest = z.infer<typeof SmsCreateRequestSchema>;
