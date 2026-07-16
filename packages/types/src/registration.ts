import type { z } from "zod";
import type {
  IdentityInsertSchema,
  IdentitySelectSchema,
  RegistrationInsertSchema,
  RegistrationSelectSchema,
  OfflineRegistrationFormSchema,
  SyncPushRecordSchema,
  SyncPushRequestSchema,
} from "@lastmile/validators/registration";

// ── Database Models ──

export type Identity = z.infer<typeof IdentitySelectSchema>;
export type InsertIdentity = z.infer<typeof IdentityInsertSchema>;

export type Registration = z.infer<typeof RegistrationSelectSchema>;
export type InsertRegistration = z.infer<typeof RegistrationInsertSchema>;

// ── Form Payloads ──

export type OfflineRegistrationForm = z.infer<typeof OfflineRegistrationFormSchema>;

// ── API Request / Response ──

export type SyncPushRecord = z.infer<typeof SyncPushRecordSchema>;
export type SyncPushRequest = z.infer<typeof SyncPushRequestSchema>;

export type SyncPushResponse = {
  success: boolean;
  syncedCount: number;
  failedRecords: string[];
};
