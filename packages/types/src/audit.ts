import type { AuditLogInsertSchema, AuditLogSelectSchema } from "@lastmile/validators/audit";
import type { z } from "zod/v4";

export type AuditLog = z.infer<typeof AuditLogSelectSchema>;
export type InsertAuditLog = z.infer<typeof AuditLogInsertSchema>;
