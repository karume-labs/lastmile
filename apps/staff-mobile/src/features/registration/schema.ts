import { z } from "zod";

// Mirrors the fields the finance officer's disbursement CSV keys off of later
// (phone number, external reference ID, verification value) so a registration
// captured here can be matched straight to a disbursement without re-entry.
// TODO: once packages/validators/src/registration.ts is filled in by the
// backend/db owner, swap this for the shared schema instead of duplicating it.

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

const phoneRegex = /^\+?[0-9]{9,15}$/;

export const registrationFormSchema = z
  .object({
    // Beneficiary
    fullName: z.string().trim().min(2, "Enter the beneficiary's full name"),
    dateOfBirth: z.string().min(1, "Enter a date of birth"),
    gender: z.enum(["female", "male", "other"], { message: "Select a gender" }),
    hasPhone: z.boolean(),
    phoneNumber: z.string().trim().optional(),

    // Verification (matches the SDP disbursement CSV contract)
    externalReferenceId: z.string().trim().min(2, "Enter an external reference ID"),
    verificationType: z.enum(["DATE_OF_BIRTH", "NATIONAL_ID_NUMBER", "PIN"], {
      message: "Select a verification type",
    }),
    verificationValue: z.string().trim().min(2, "Enter the verification value"),

    // Location & programme
    locationLabel: z.string().trim().min(2, "Enter the registration location"),
    programmeId: z.string().min(1, "Select a programme"),
    programmeName: z.string().min(1),
    coordinates: z.object({ latitude: z.number(), longitude: z.number() }).nullable(),

    // Proxy (required only when the beneficiary has no phone)
    proxyFullName: z.string().trim().optional(),
    proxyPhoneNumber: z.string().trim().optional(),
    proxyRelationship: z.string().optional(),
    proxyNationalId: z.string().trim().optional(),

    // Photo & consent
    photoUri: z.string().nullable(),
    consentGiven: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.hasPhone) {
      if (!data.phoneNumber || !phoneRegex.test(data.phoneNumber)) {
        ctx.addIssue({ code: "custom", path: ["phoneNumber"], message: "Enter a valid phone number" });
      }
    } else {
      if (!data.proxyFullName || data.proxyFullName.trim().length < 2) {
        ctx.addIssue({ code: "custom", path: ["proxyFullName"], message: "Enter the proxy's full name" });
      }
      if (!data.proxyPhoneNumber || !phoneRegex.test(data.proxyPhoneNumber)) {
        ctx.addIssue({ code: "custom", path: ["proxyPhoneNumber"], message: "Enter a valid proxy phone number" });
      }
      if (!data.proxyRelationship) {
        ctx.addIssue({
          code: "custom",
          path: ["proxyRelationship"],
          message: "Select how the proxy is related to the beneficiary",
        });
      }
    }
    if (!data.consentGiven) {
      ctx.addIssue({
        code: "custom",
        path: ["consentGiven"],
        message: "Consent is required to register a participant",
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
