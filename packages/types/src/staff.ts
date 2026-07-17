import type { ToggleBanSchema, UpdateStaffSchema } from "@lastmile/validators/staff";
import type { z } from "zod/v4";

export type UpdateStaffRequest = z.infer<typeof UpdateStaffSchema>;
export type ToggleBanRequest = z.infer<typeof ToggleBanSchema>;
