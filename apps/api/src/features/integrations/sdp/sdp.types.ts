/**
 * features/integrations/sdp/sdp.types.ts
 *
 * Shared types for the SDP integration boundary.
 *
 * These types describe the shape of data crossing the LastMile <-> SDP
 * boundary. They intentionally live separately from Prisma's generated
 * types (e.g. `DisbursementStatus`) so that:
 *   - sdp.client.ts can be swapped (mock -> real HTTP) without any
 *     consumer needing to change.
 *   - SDP's vocabulary is never assumed to be identical to LastMile's
 *     internal vocabulary, even if today the four states happen to line up.
 *     The adapter is the only place that translates between the two.
 */

/**
 * SDP's own representation of disbursement status.
 * Named separately from Prisma's `DisbursementStatus` on purpose —
 * this is SDP's vocabulary, not ours. The adapter maps this to our
 * Prisma enum; nothing outside sdp.adapter.ts should import this type.
 */
export type SdpDisbursementStatus =
  | 'PENDING'
  | 'CLAIMED'
  | 'EXPIRED'
  | 'CLAWED_BACK';

/**
 * A disbursement record as SDP reports it.
 * `sdpId` is SDP's own identifier — it is the value we persist on our
 * local `Disbursement.sdpId` column to correlate records.
 * `participantReferenceId` is LastMile's Reference ID (the value SDP was
 * given when Registration/Sync registered the receiver) — this is how we
 * tie an SDP-owned disbursement back to a local `Participant`.
 */
export interface SdpDisbursementRecord {
  sdpId: string;
  participantReferenceId: string;
  amount: number;
  currency: string;
  status: SdpDisbursementStatus;
  /** The date SDP intends to release funds / open the claim window. */
  scheduledFor: string; // ISO 8601 — kept as string across the wire boundary
  updatedAt: string; // ISO 8601
}

/** Optional filters for discovery/polling. */
export interface ListDisbursementsParams {
  /** Only return disbursements updated on/after this timestamp. */
  updatedSince?: Date;
  /** Restrict to a specific SDP-side status. */
  status?: SdpDisbursementStatus;
}

/**
 * Result of submitting a claim (Reference ID + OTP) to SDP.
 * LastMile does NOT validate the OTP itself — this is purely relaying
 * SDP's business decision back to the caller (the USSD flow, via the
 * Disbursement Process Service).
 */
export type ClaimDisbursementResult =
  | { success: true; status: 'CLAIMED' }
  | { success: false; reason: ClaimFailureReason };

export type ClaimFailureReason =
  | 'INVALID_OTP'
  | 'EXPIRED'
  | 'ALREADY_CLAIMED'
  | 'NOT_FOUND'
  | 'SDP_UNAVAILABLE';

/**
 * Result of a clawback request. Mocked as synchronous for the MVP per
 * the finalized architecture — a real HTTP implementation may need to
 * evolve this to a pending/async shape later, but that change is scoped
 * to sdp.client.ts / sdp.adapter.ts only.
 */
export type ClawbackResult =
  | { success: true; status: 'CLAWED_BACK' }
  | { success: false; reason: string };