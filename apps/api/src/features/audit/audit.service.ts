/**
 * features/audit/audit.service.ts
 *
 * Exposes a single `logAudit()` function — the only thing other
 * features should import from `audit`. Kept as a plain function
 * rather than a class needing dependency injection, since the only
 * behavior here is "write an entry, don't let it break the caller."
 *
 * Design decision: audit writes never throw to the caller. A failed
 * audit write should never block a fund claim, a clawback approval,
 * or a USSD response — those are the actual business-critical paths.
 * Instead, failures are logged via the app logger so they're visible
 * to operators without taking down the primary flow.
 *
 * ASSUMPTION: `config/logger.ts` exports a `logger` with at least
 * `.error()`. Matches the file already listed in the project structure.
 */

import { logger } from '../../config/logger';
import { auditRepository } from './audit.repository';
import { CreateAuditLogInput } from './audit.types';

export async function logAudit(entry: CreateAuditLogInput): Promise<void> {
  try {
    await auditRepository.create(entry);
  } catch (err) {
    logger.error('Failed to write audit log entry', {
      action: entry.action,
      userId: entry.userId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}