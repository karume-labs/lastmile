import type { z } from "zod";
import type { AuthRegisterSchema, AuthLoginSchema } from "@lastmile/validators/auth";

// ── API Request / Response ──

export type AuthRegister = z.infer<typeof AuthRegisterSchema>;
export type AuthLogin = z.infer<typeof AuthLoginSchema>;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "REGISTRAR";
};

export type AuthLoginResponse = {
  user: AuthUser;
  token: string;
};
