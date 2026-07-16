import { z } from "zod";
import {
  nameSchema,
  dateSchema,
  phoneSchema,
  idNumberSchema,
  boundedTextSchema,
} from "@lastmile/validators/registration";

// Re-export for app usage
export { sanitizeInput, sanitizeName, sanitizePhoneNumber } from "@lastmile/validators/registration";

export const verificationTypes = [
  { value: "DATE_OF_BIRTH", label: "Date of Birth" },
  { value: "NATIONAL_ID_NUMBER", label: "National ID Number" },
  { value: "PIN", label: "Personal PIN" },
] as const;

export const genders = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other / prefer not to say" },
] as const;

export const proxyRelationships = [
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "parent", label: "Parent" },
  { value: "neighbor", label: "Neighbor" },
  { value: "community_elder", label: "Community Elder" },
  { value: "other", label: "Other" },
] as const;

/**
 * Professional registration form schema with:
 * - Enterprise-grade input validation
 * - Input sanitization
 * - Proper type bounds for all fields
 * - Security checks for injection prevention
 * - Logical constraints validation
 */
export const registrationFormSchema = z
  .object({
    // Beneficiary information
    fullName: nameSchema.describe("Full legal name of the beneficiary"),
    dateOfBirth: dateSchema.describe("Date of birth (ISO 8601 format)"),
    gender: z.enum(["female", "male", "other"], { message: "Select a valid gender" }),
    hasPhone: z.boolean().describe("Whether beneficiary owns a mobile phone"),
    phoneNumber: phoneSchema.optional().describe("Beneficiary's phone number"),

    // Verification information (matches SDP disbursement CSV contract)
    externalReferenceId: idNumberSchema.describe("External reference ID from primary system"),
    verificationType: z.enum(["DATE_OF_BIRTH", "NATIONAL_ID_NUMBER", "PIN"], {
      message: "Select a verification type",
    }),
    verificationValue: boundedTextSchema(5, 100).describe("Value for verification"),

    // Location and programme
    locationLabel: boundedTextSchema(2, 200).describe("Registration location name"),
    programmeId: z.string().min(1, "Select a programme").max(100),
    programmeName: z.string().min(1).max(200),
    coordinates: z
      .object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) })
      .nullable()
      .optional(),

    // Proxy information (required only when hasPhone is false)
    proxyFullName: nameSchema.optional().describe("Full name of the proxy/representative"),
    proxyPhoneNumber: phoneSchema.optional().describe("Proxy's phone number"),
    proxyRelationship: z
      .enum(["spouse", "child", "sibling", "parent", "neighbor", "community_elder", "other"])
      .optional(),
    proxyNationalId: idNumberSchema.optional().describe("Proxy's national ID number"),

    // Photo and consent
    photoUri: z.string().max(500).nullable().optional(),
    consentGiven: z.boolean().refine((v) => v === true, {
      message: "You must give consent to register the participant",
    }),
  })
  .strict()
  .superRefine((data, ctx) => {
    // If beneficiary has phone, phone number is required
    if (data.hasPhone) {
      if (!data.phoneNumber) {
        ctx.addIssue({
          code: "custom",
          path: ["phoneNumber"],
          message: "Phone number is required when beneficiary has a phone",
        });
      }
    }
    // If beneficiary doesn't have phone, proxy info is required
    else {
      if (!data.proxyFullName || data.proxyFullName.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["proxyFullName"],
          message: "Proxy's full name is required",
        });
      }
      if (!data.proxyPhoneNumber || data.proxyPhoneNumber.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["proxyPhoneNumber"],
          message: "Proxy's phone number is required",
        });
      }
      if (!data.proxyRelationship) {
        ctx.addIssue({
          code: "custom",
          path: ["proxyRelationship"],
          message: "Proxy relationship is required",
        });
      }
    }

    // Consent must be given
    if (!data.consentGiven) {
      ctx.addIssue({
        code: "custom",
        path: ["consentGiven"],
        message: "Participant consent is mandatory to proceed",
      });
    }
  });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export const stepFields = {
  beneficiary: ["fullName", "dateOfBirth", "gender", "hasPhone", "phoneNumber"],
  verification: ["externalReferenceId", "verificationType", "verificationValue"],
  location: ["locationLabel", "programmeId", "programmeName", "coordinates"],
  proxy: ["proxyFullName", "proxyPhoneNumber", "proxyRelationship", "proxyNationalId"],
  consent: ["photoUri", "consentGiven"],
} as const satisfies Record<string, ReadonlyArray<keyof RegistrationFormValues>>;

export const defaultRegistrationValues: RegistrationFormValues = {
  fullName: "",
  dateOfBirth: "",
  gender: "female",
  hasPhone: true,
  phoneNumber: "",
  externalReferenceId: "",
  verificationType: "NATIONAL_ID_NUMBER",
  verificationValue: "",
  locationLabel: "",
  programmeId: "",
  programmeName: "",
  coordinates: null,
  proxyFullName: "",
  proxyPhoneNumber: "",
  proxyRelationship: undefined,
  proxyNationalId: "",
  photoUri: null,
  consentGiven: false,
};

