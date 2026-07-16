import { identities } from "@lastmile/db/schemas/identity";
import { registrations } from "@lastmile/db/schemas/registration";
import { currencySchema, phoneNumberSchema } from "@lastmile/validators/shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ── Base Drizzle-derived schemas ──

export const IdentityInsertSchema = createInsertSchema(identities);
export const IdentitySelectSchema = createSelectSchema(identities);

export const RegistrationInsertSchema = createInsertSchema(registrations);
export const RegistrationSelectSchema = createSelectSchema(registrations);

// ── Bulk Upload Row Form ──
export const BulkUploadRowSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: phoneNumberSchema,
  currency: currencySchema,
  preferredLanguage: z.enum(["en", "sw", "tu"]).default("en"),
  isProxy: z.boolean(),
});

export const BulkUploadRequestSchema = z
  .array(BulkUploadRowSchema)
  .min(1, "The uploaded file must contain at least one row.")
  .max(5000, "You can only upload up to 5000 rows at once.");

export * from "@lastmile/validators/sync";
