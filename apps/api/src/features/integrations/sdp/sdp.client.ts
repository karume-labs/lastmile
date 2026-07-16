/**
 * features/integrations/sdp/sdp.client.ts
 *
 * The raw transport-level client for talking to SDP.
 *
 * `ISdpClient` is the contract every implementation must satisfy.
 * `MockSdpClient` is the MVP implementation — in-memory, deterministic,
 * synchronous. A future `HttpSdpClient` implements the same interface
 * and can be swapped in via sdp.config.ts / the factory in this file
 * WITHOUT touching sdp.adapter.ts or any business service that depends
 * on the adapter.
 *
 * Nothing outside this feature should import `MockSdpClient` directly —
 * always go through `getSdpClient()` or the adapter.
 */

import {
  ClaimDisbursementResult,
  ClawbackResult,
  ListDisbursementsParams,
  SdpDisbursementRecord,
  SdpDisbursementStatus,
} from './sdp.types';

export interface ISdpClient {
  /**
   * List disbursements known to SDP, optionally filtered.
   * Used by LastMile's disbursement monitoring/polling job to discover
   * disbursements SDP has created and to pick up status changes.
   */
  listDisbursements(
    params?: ListDisbursementsParams,
  ): Promise<SdpDisbursementRecord[]>;

  /** Fetch the current state of a single disbursement by SDP's id. */
  getDisbursementStatus(sdpId: string): Promise<SdpDisbursementRecord>;

  /**
   * Submit a claim attempt. SDP performs OTP validation and fund release
   * internally; LastMile only relays the Reference ID + OTP and reports
   * the business result back.
   */
  claimDisbursement(
    referenceId: string,
    otp: string,
  ): Promise<ClaimDisbursementResult>;

  /** Request SDP perform a clawback on a previously released disbursement. */
  requestClawback(sdpId: string, reason: string): Promise<ClawbackResult>;
}

/**
 * In-memory mock SDP implementation for the MVP.
 *
 * Seeded with a handful of fake disbursements so the disbursements,
 * ussd, notifications, and clawbacks features all have something
 * realistic to work against in local/dev/test environments.
 *
 * OTP convention for the mock: any OTP === "0000" simulates SDP
 * rejecting the claim (invalid OTP). Any other 4-digit value succeeds,
 * as long as the disbursement is currently PENDING.
 */
export class MockSdpClient implements ISdpClient {
  private store = new Map<string, SdpDisbursementRecord>();

  constructor(seed: SdpDisbursementRecord[] = MockSdpClient.defaultSeed()) {
    for (const record of seed) {
      this.store.set(record.sdpId, record);
    }
  }

  private static defaultSeed(): SdpDisbursementRecord[] {
    const now = new Date();
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return [
      {
        sdpId: 'sdp_disb_001',
        participantReferenceId: 'REF-0001',
        amount: 5000,
        currency: 'KES',
        status: 'PENDING',
        scheduledFor: inTwoDays.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        sdpId: 'sdp_disb_002',
        participantReferenceId: 'REF-0002',
        amount: 5000,
        currency: 'KES',
        status: 'PENDING',
        scheduledFor: yesterday.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];
  }

  async listDisbursements(
    params?: ListDisbursementsParams,
  ): Promise<SdpDisbursementRecord[]> {
    let results = Array.from(this.store.values());

    if (params?.status) {
      results = results.filter((r) => r.status === params.status);
    }
    if (params?.updatedSince) {
      const since = params.updatedSince.getTime();
      results = results.filter(
        (r) => new Date(r.updatedAt).getTime() >= since,
      );
    }

    return this.clone(results);
  }

  async getDisbursementStatus(sdpId: string): Promise<SdpDisbursementRecord> {
    const record = this.store.get(sdpId);
    if (!record) {
      throw new SdpNotFoundError(sdpId);
    }
    return this.clone(record);
  }

  async claimDisbursement(
    referenceId: string,
    otp: string,
  ): Promise<ClaimDisbursementResult> {
    const record = Array.from(this.store.values()).find(
      (r) => r.participantReferenceId === referenceId,
    );

    if (!record) {
      return { success: false, reason: 'NOT_FOUND' };
    }
    if (record.status === 'CLAIMED') {
      return { success: false, reason: 'ALREADY_CLAIMED' };
    }
    if (record.status === 'EXPIRED' || record.status === 'CLAWED_BACK') {
      return { success: false, reason: 'EXPIRED' };
    }
    if (otp === '0000') {
      return { success: false, reason: 'INVALID_OTP' };
    }

    this.setStatus(record.sdpId, 'CLAIMED');
    return { success: true, status: 'CLAIMED' };
  }

  async requestClawback(
    sdpId: string,
    _reason: string,
  ): Promise<ClawbackResult> {
    const record = this.store.get(sdpId);
    if (!record) {
      return { success: false, reason: 'NOT_FOUND' };
    }

    this.setStatus(sdpId, 'CLAWED_BACK');
    return { success: true, status: 'CLAWED_BACK' };
  }

  /** Test/dev helper — not part of ISdpClient, only available on the mock. */
  private setStatus(sdpId: string, status: SdpDisbursementStatus): void {
    const record = this.store.get(sdpId);
    if (!record) return;
    this.store.set(sdpId, {
      ...record,
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}

export class SdpNotFoundError extends Error {
  constructor(sdpId: string) {
    super(`SDP disbursement not found: ${sdpId}`);
    this.name = 'SdpNotFoundError';
  }
}

/**
 * Factory — the single place that decides which ISdpClient implementation
 * is active. Swapping mock -> real HTTP later means adding an
 * `HttpSdpClient implements ISdpClient` class and changing only the
 * branch below (or the env var it reads). No consumer code changes.
 */
let cachedClient: ISdpClient | null = null;

export function getSdpClient(): ISdpClient {
  if (!cachedClient) {
    // SDP_CLIENT_MODE reserved for future 'http' branch.
    // MVP: always mock.
    cachedClient = new MockSdpClient();
  }
  return cachedClient;
}