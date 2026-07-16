import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { identities } from "@lastmile/db/schemas/identity";
import { registrations } from "@lastmile/db/schemas/registration";
import { phoneNumberSchema, currencySchema } from "./shared";

// ── Base Drizzle-derived schemas ──

export const IdentityInsertSchema = createInsertSchema(identities);
export const IdentitySelectSchema = createSelectSchema(identities);

export const RegistrationInsertSchema = createInsertSchema(registrations);
export const RegistrationSelectSchema = createSelectSchema(registrations);

// ── React Native Offline Form ──
// Validates the intake form on the tablet before queueing for sync.
// No id/timestamps — those are generated server-side.

export const OfflineRegistrationFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: phoneNumberSchema,
  currency: currencySchema,
  isProxy: z.boolean(),
});

// ── Sync Push Request ──
// Validates POST /api/sync/push body — a batch of offline records
// that the tablet uploads when connectivity is restored.

export const SyncPushRecordSchema = z.object({
  localId: z.string().uuid(),
  fullName: z.string().min(1),
  referenceId: z.string().min(1),
  phoneNumber: phoneNumberSchema,
  currency: currencySchema,
  isProxy: z.boolean(),
});

export const SyncPushRequestSchema = z.object({
  records: z.array(SyncPushRecordSchema).min(1).max(500),
});
