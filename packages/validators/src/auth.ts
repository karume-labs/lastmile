import { z } from "zod";

export const AuthRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["ADMIN", "REGISTRAR"]),
});

export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
