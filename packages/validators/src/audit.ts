import { auditLogs } from "@lastmile/db/schemas/audit";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const AuditLogInsertSchema = createInsertSchema(auditLogs);
export const AuditLogSelectSchema = createSelectSchema(auditLogs);
