/**
 * features/audit/index.ts
 *
 * Public surface of the audit feature. Other features should import
 * only `logAudit` and the `AuditAction` type from here, e.g.:
 *
 *   import { logAudit } from '@lastmile/api/features/audit';
 *
 *   await logAudit({
 *     userId: req.user?.id ?? null,
 *     action: 'CLAWBACK_APPROVED',
 *     details: `Clawback ${clawbackId} approved for disbursement ${disbursementId}`,
 *     ipAddress: req.ip,
 *   });
 *
 * `auditRepository` is exported for cases like an admin dashboard
 * endpoint that needs `findRecent`/`findByAction` reads directly —
 * but write paths everywhere else should go through `logAudit`, not
 * the repository, so failure handling stays consistent.
 */

export { logAudit } from './audit.service';
export { auditRepository, AuditRepository } from './audit.repository';
export type { AuditAction, CreateAuditLogInput } from './audit.types';