/**
 * features/integrations/sdp/index.ts
 *
 * Public surface of the SDP integration feature. Other features
 * (disbursements, ussd, clawbacks) should import from here, e.g.:
 *
 *   import { sdpAdapter, RemoteDisbursement } from '@lastmile/api/features/integrations/sdp';
 *
 * sdp.client.ts internals (ISdpClient, MockSdpClient, getSdpClient) are
 * intentionally NOT re-exported here — they are implementation details
 * of the adapter and should never be imported directly by business
 * services. This keeps the swap-to-real-HTTP path clean: only this
 * feature's internals change, the public surface does not.
 */

export { SdpAdapter, sdpAdapter } from './sdp.adapter';
export type { RemoteDisbursement } from './sdp.adapter';
export type {
  ClaimDisbursementResult,
  ClaimFailureReason,
  ClawbackResult,
} from './sdp.types';