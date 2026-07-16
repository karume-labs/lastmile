import { z } from "zod/v4";

export const uuidSchema = z.string().uuid();

export const phoneNumberSchema = z
  .string()
  .regex(/^\+[1-9]\d{6,14}$/, "Must be a valid E.164 phone number");

export const currencySchema = z.enum(["KES", "USD", "USDC"]);
