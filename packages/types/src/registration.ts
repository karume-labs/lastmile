import type {
  BulkUploadRowSchema,
  IdentityInsertSchema,
  IdentitySelectSchema,
  RegistrationInsertSchema,
  RegistrationSelectSchema,
} from "@lastmile/validators/registration";
import type { z } from "zod";

// ── Database Models ──

export type Identity = z.infer<typeof IdentitySelectSchema>;
export type InsertIdentity = z.infer<typeof IdentityInsertSchema>;

export type Registration = z.infer<typeof RegistrationSelectSchema>;
export type InsertRegistration = z.infer<typeof RegistrationInsertSchema>;

// ── Form Payloads ──

export type BulkUploadRow = z.infer<typeof BulkUploadRowSchema>;
