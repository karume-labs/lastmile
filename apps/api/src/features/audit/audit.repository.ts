/**
 * features/audit/audit.repository.ts
 *
 * Thin Prisma-backed repository for the AuditLog model.
 *
 * ASSUMPTION (needs confirmation from the team): a shared Prisma
 * client singleton exists at `src/config/prisma.ts`, exported as
 * `prisma`. The given project structure doesn't show this file
 * explicitly, but every module that touches the database needs one,
 * and this is the conventional location for it. If your teammate's
 * modules already export a client from elsewhere (e.g.
 * `shared/db/client.ts`), update this single import and the same
 * fix applies everywhere else I import Prisma.
 */

import { AuditLog, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateAuditLogInput } from './audit.types';

export class AuditRepository {
  /** Write a single audit entry. Never throws to callers that don't await it. */
  async create(entry: CreateAuditLogInput): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        action: entry.action,
        details: entry.details,
        ipAddress: entry.ipAddress ?? null,
      },
    });
  }

  /** Recent entries, newest first — useful for an admin dashboard feed. */
  async findRecent(limit = 50): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /** Entries filtered by action, newest first — e.g. all clawback decisions. */
  async findByAction(
    action: CreateAuditLogInput['action'],
    limit = 50,
  ): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /** Entries for a given user (e.g. "everything this admin did"). */
  async findByUserId(userId: string, limit = 50): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const auditRepository = new AuditRepository();