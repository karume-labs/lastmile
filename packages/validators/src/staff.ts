import { z } from "zod/v4";

export const UpdateStaffSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["admin", "staff"]).optional(),
});

export const ToggleBanSchema = z.object({
  banned: z.boolean(),
});
