import type {
  BulkUploadRowSchema,
  IdentityInsertSchema,
  IdentitySelectSchema,
  RegistrationInsertSchema,
  RegistrationSelectSchema,
} from "@lastmile/validators/registration";
import type { z } from "zod";
import type { z as zV4 } from "zod/v4";

// ── Database Models ──

export type Identity = zV4.infer<typeof IdentitySelectSchema>;
export type InsertIdentity = zV4.infer<typeof IdentityInsertSchema>;

export type Registration = zV4.infer<typeof RegistrationSelectSchema>;
export type InsertRegistration = zV4.infer<typeof RegistrationInsertSchema>;

// ── Form Payloads ──

export type BulkUploadRow = z.infer<typeof BulkUploadRowSchema>;
