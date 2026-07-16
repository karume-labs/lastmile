import type { AuditLogInsertSchema, AuditLogSelectSchema } from "@lastmile/validators/audit";
import type { z } from "zod";

export type AuditLog = z.infer<typeof AuditLogSelectSchema>;
export type InsertAuditLog = z.infer<typeof AuditLogInsertSchema>;
