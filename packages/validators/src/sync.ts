import { z } from "zod";

export const SyncRecordSchema = z.object({
  localId: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  referenceId: z.string().min(1, "Reference ID is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  currency: z.string().min(1, "Currency is required"),
  preferredLanguage: z.enum(["en", "sw", "tu"]).optional().default("en"),
  isProxy: z.boolean().optional().default(false),
});

export const SyncRequestSchema = z.object({
  records: z.array(SyncRecordSchema),
});

export type SyncRecord = z.infer<typeof SyncRecordSchema>;
export type SyncRequest = z.infer<typeof SyncRequestSchema>;
