/**
 * features/integrations/sdp/sdp.adapter.ts
 *
 * The ONLY feature in the codebase that business services should import
 * to talk to SDP. Controllers and services (disbursements, ussd,
 * clawbacks) must depend on this adapter — never on sdp.client.ts
 * directly, and never construct MockSdpClient / HttpSdpClient themselves.
 *
 * Responsibilities:
 *   - Translate SDP's vocabulary (SdpDisbursementStatus, raw records)
 *     into LastMile's internal vocabulary (Prisma's DisbursementStatus).
 *   - Present a small, stable, domain-shaped API surface so that if
 *     SDP's actual API changes shape, only this file and sdp.client.ts
 *     need to change.
 *
 * Explicitly OUT of scope here (per finalized architecture):
 *   - registerReceiver() — owned by Registration/Sync's own SDP
 *     integration, not this feature.
 *   - createDisbursement() — LastMile does not create disbursements;
 *     SDP owns their creation entirely. This feature only discovers
 *     and monitors disbursements SDP already created.
 */

import { DisbursementStatus } from '@prisma/client';
import { getSdpClient, ISdpClient } from './sdp.client';
import {
  ClaimDisbursementResult,
  ClawbackResult,
  SdpDisbursementRecord,
  SdpDisbursementStatus,
} from './sdp.types';

/**
 * A disbursement record translated into LastMile's internal vocabulary.
 * This is what disbursements/notifications/clawbacks modules should
 * consume — never the raw SdpDisbursementRecord.
 */
export interface RemoteDisbursement {
  sdpId: string;
  participantReferenceId: string;
  amount: number;
  currency: string;
  status: DisbursementStatus;
  scheduledFor: Date;
  updatedAt: Date;
}

export class SdpAdapter {
  constructor(private readonly client: ISdpClient = getSdpClient()) {}

  /**
   * Discover/refresh disbursements SDP currently knows about.
   * Used by the disbursements feature's polling job to mirror SDP state
   * into local `Disbursement` rows (create-if-missing, update status).
   */
  async listDisbursements(params?: {
    updatedSince?: Date;
    status?: DisbursementStatus;
  }): Promise<RemoteDisbursement[]> {
    const records = await this.client.listDisbursements({
      updatedSince: params?.updatedSince,
      status: params?.status
        ? this.toSdpStatus(params.status)
        : undefined,
    });
    return records.map((r) => this.toRemoteDisbursement(r));
  }

  /** Refresh a single disbursement's status by SDP id. */
  async getDisbursementStatus(sdpId: string): Promise<RemoteDisbursement> {
    const record = await this.client.getDisbursementStatus(sdpId);
    return this.toRemoteDisbursement(record);
  }

  /**
   * Submit a claim (Reference ID + OTP) collected via USSD.
   * LastMile never validates the OTP itself — this purely relays SDP's
   * business decision. Callers (Disbursement Process Service) should
   * treat the return value as authoritative for updating local status.
   */
  async claimDisbursement(
    referenceId: string,
    otp: string,
  ): Promise<ClaimDisbursementResult> {
    return this.client.claimDisbursement(referenceId, otp);
  }

  /**
   * Request SDP perform a clawback. Only called after an administrator
   * has approved a ClawbackRequest — this module has no opinion on
   * whether a clawback is warranted, it only executes what's approved.
   */
  async requestClawback(
    sdpId: string,
    reason: string,
  ): Promise<ClawbackResult> {
    return this.client.requestClawback(sdpId, reason);
  }

  // ---- translation helpers -------------------------------------------

  private toRemoteDisbursement(
    record: SdpDisbursementRecord,
  ): RemoteDisbursement {
    return {
      sdpId: record.sdpId,
      participantReferenceId: record.participantReferenceId,
      amount: record.amount,
      currency: record.currency,
      status: this.toPrismaStatus(record.status),
      scheduledFor: new Date(record.scheduledFor),
      updatedAt: new Date(record.updatedAt),
    };
  }

  /**
   * SDP's four states currently line up 1:1 with Prisma's
   * DisbursementStatus enum, but this mapping is kept explicit
   * (rather than a type cast) so that if either vocabulary drifts
   * in the future, only this function needs to change.
   */
  private toPrismaStatus(status: SdpDisbursementStatus): DisbursementStatus {
    switch (status) {
      case 'PENDING':
        return DisbursementStatus.PENDING;
      case 'CLAIMED':
        return DisbursementStatus.CLAIMED;
      case 'EXPIRED':
        return DisbursementStatus.EXPIRED;
      case 'CLAWED_BACK':
        return DisbursementStatus.CLAWED_BACK;
      default: {
        const exhaustiveCheck: never = status;
        throw new Error(`Unmapped SDP status: ${exhaustiveCheck}`);
      }
    }
  }

  private toSdpStatus(status: DisbursementStatus): SdpDisbursementStatus {
    switch (status) {
      case DisbursementStatus.PENDING:
        return 'PENDING';
      case DisbursementStatus.CLAIMED:
        return 'CLAIMED';
      case DisbursementStatus.EXPIRED:
        return 'EXPIRED';
      case DisbursementStatus.CLAWED_BACK:
        return 'CLAWED_BACK';
      default: {
        const exhaustiveCheck: never = status;
        throw new Error(`Unmapped Prisma status: ${exhaustiveCheck}`);
      }
    }
  }
}

/** Shared singleton — services should import this, not construct their own. */
export const sdpAdapter = new SdpAdapter();