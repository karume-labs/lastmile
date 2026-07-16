import type { AuthSignInSchema, AuthSignUpSchema } from "@lastmile/validators/auth";
import type { z } from "zod/v4";

// ── API Request / Response ──

export type AuthSignUpRequest = z.infer<typeof AuthSignUpSchema>;
export type AuthSignInRequest = z.infer<typeof AuthSignInSchema>;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "REGISTRAR";
};

export type AuthSignInResponse = {
  user: AuthUser;
  token: string;
};
