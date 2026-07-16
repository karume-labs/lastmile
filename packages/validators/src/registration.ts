import { z } from "zod";

/**
 * Professional input validators for staff-mobile registration
 * Ensures data is properly typed, bounded, and safe across the entire system
 */

// Email validator following RFC 5322 (simplified but strict)
const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Email must be at least 5 characters")
  .max(255, "Email must not exceed 255 characters")
  .regex(emailRegex, "Enter a valid email address")
  .superRefine((email, ctx) => {
    // Prevent common injection patterns
    if (email.includes("<") || email.includes(">") || email.includes('"') || email.includes("'")) {
      ctx.addIssue({
        code: "custom",
        message: "Email contains invalid characters",
      });
    }
  });

// Password validator: must be strong but reasonable
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain a special character")
  .superRefine((password, ctx) => {
    // Prevent common weak passwords
    const weakPatterns = ["password", "123456", "qwerty", "admin"];
    if (weakPatterns.some((p) => password.toLowerCase().includes(p))) {
      ctx.addIssue({
        code: "custom",
        message: "This password is too common. Please choose a stronger one.",
      });
    }
  });

// Phone number validator (E.164 format plus some flexibility)
const phoneRegex = /^\+?[0-9]{9,15}$/;
export const phoneSchema = z
  .string()
  .trim()
  .regex(phoneRegex, "Enter a valid phone number (9-15 digits)")
  .superRefine((phone, ctx) => {
    // Remove non-digits for length check
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      ctx.addIssue({
        code: "custom",
        message: "Phone number must be between 9 and 15 digits",
      });
    }
  });

// Name validator: prevent injection, ensure reasonable length
export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must not exceed 100 characters")
  .regex(/^[a-zA-Z\s\-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .superRefine((name, ctx) => {
    // Ensure it's not just spaces/special chars
    if (!/[a-zA-Z]/.test(name)) {
      ctx.addIssue({
        code: "custom",
        message: "Name must contain at least one letter",
      });
    }
  });

// Date validator: validate as date object, not just string
export const dateSchema = z
  .string()
  .refine((dateStr) => !isNaN(Date.parse(dateStr)), "Invalid date format")
  .superRefine((dateStr, ctx) => {
    const date = new Date(dateStr);
    const today = new Date();

    // Cannot be in the future
    if (date > today) {
      ctx.addIssue({
        code: "custom",
        message: "Date cannot be in the future",
      });
    }

    // Must be reasonable age (assume 18+)
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const actualAge = monthDiff < 0 ? age - 1 : age;

    if (actualAge < 18) {
      ctx.addIssue({
        code: "custom",
        message: "Beneficiary must be at least 18 years old",
      });
    }

    // Sanity check: not too old (unlikely to be 130+ years old)
    if (actualAge > 130) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a realistic date of birth",
      });
    }
  });

// ID number validator (flexible for different ID formats)
export const idNumberSchema = z
  .string()
  .trim()
  .min(5, "ID number must be at least 5 characters")
  .max(50, "ID number must not exceed 50 characters")
  .regex(/^[a-zA-Z0-9\-]+$/, "ID number can only contain letters, numbers, and hyphens");

// Generic text validator with bounds
export const boundedTextSchema = (minLength: number = 2, maxLength: number = 500) =>
  z
    .string()
    .trim()
    .min(minLength, `Must be at least ${minLength} characters`)
    .max(maxLength, `Must not exceed ${maxLength} characters`)
    .superRefine((text, ctx) => {
      // Prevent script injection patterns
      const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /<iframe/i];
      if (dangerousPatterns.some((p) => p.test(text))) {
        ctx.addIssue({
          code: "custom",
          message: "Input contains invalid characters or patterns",
        });
      }
    });

// Data sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/&/g, "&amp;") // Escape ampersands
    .substring(0, 500); // Max 500 chars as safety net
};

export const sanitizeName = (name: string): string => {
  return name
    .trim()
    .replace(/[^a-zA-Z\s\-']/g, "") // Only allow safe characters
    .substring(0, 100);
};

export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d+]/g, "").substring(0, 15);
};

/**
 * Input type specifications for proper keyboard and validation
 */
export const inputTypeSpecs = {
  email: {
    keyboardType: "email-address" as const,
    autoCapitalize: "none" as const,
    autoComplete: "email" as const,
    validator: emailSchema,
  },
  password: {
    keyboardType: "default" as const,
    autoCapitalize: "none" as const,
    autoComplete: "password" as const,
    secureTextEntry: true,
    validator: passwordSchema,
  },
  phone: {
    keyboardType: "phone-pad" as const,
    autoCapitalize: "none" as const,
    autoComplete: "tel" as const,
    validator: phoneSchema,
  },
  name: {
    keyboardType: "default" as const,
    autoCapitalize: "words" as const,
    validator: nameSchema,
  },
  date: {
    keyboardType: "numeric" as const,
    validator: dateSchema,
  },
  id: {
    keyboardType: "default" as const,
    autoCapitalize: "characters" as const,
    validator: idNumberSchema,
  },
} as const;
