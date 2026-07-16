/**
 * features/audit/audit.types.ts
 *
 * A closed, explicit set of audit action names for everything my
 * features (disbursements, ussd, notifications, clawbacks, sdp) do.
 *
 * Kept as a union type rather than a free-text string so that:
 *   - every call site is forced to pick from a known vocabulary
 *   - a future admin dashboard / audit report can rely on action
 *     names being stable and enumerable, not ad-hoc strings
 *
 * If other features (e.g. Registration/Sync, owned by another
 * developer) also write to AuditLog, their action names are outside
 * this union — this type only governs what MY features emit.
 */
export type AuditAction =
  // disbursements
  | 'DISBURSEMENT_DISCOVERED' // new disbursement mirrored from SDP for the first time
  | 'DISBURSEMENT_STATUS_SYNCED' // polling job picked up a status change from SDP
  | 'DISBURSEMENT_CLAIM_SUCCEEDED'
  | 'DISBURSEMENT_CLAIM_FAILED'
  // notifications
  | 'REMINDER_SMS_SENT'
  | 'REMINDER_SMS_FAILED'
  // clawbacks
  | 'CLAWBACK_REQUESTED'
  | 'CLAWBACK_APPROVED'
  | 'CLAWBACK_REJECTED'
  | 'CLAWBACK_COMPLETED'
  | 'CLAWBACK_FAILED'
  // ussd
  | 'USSD_SESSION_STARTED'
  | 'USSD_CLAIM_ATTEMPTED';

/**
 * Input shape for writing an audit entry. Mirrors the AuditLog model
 * minus generated fields (id, createdAt).
 *
 * `userId` is nullable because several actions (e.g. an inbound SDP
 * status sync, or a USSD claim attempt by a proxy who isn't a User
 * in our system) have no authenticated LastMile User behind them —
 * the schema already supports this via `onDelete: SetNull`.
 */
export interface CreateAuditLogInput {
  userId?: string | null;
  action: AuditAction;
  details: string;
  ipAddress?: string | null;
}