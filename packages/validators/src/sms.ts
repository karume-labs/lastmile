import { smsMessages } from "@lastmile/db/schemas/sms";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const SmsMessageInsertSchema = createInsertSchema(smsMessages);
export const SmsMessageSelectSchema = createSelectSchema(smsMessages);

export const SmsCreateRequestSchema = z.object({
  recipient: z.string().min(1),
  content: z.string().min(1),
});
