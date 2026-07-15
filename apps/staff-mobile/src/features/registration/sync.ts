import { type QueuedRegistration, getQueue, updateRecord } from "@/src/features/registration/queue";
import { ApiError, apiRequest } from "@/src/lib/api";

// Expected contract for apps/api's `sync` feature (currently an empty stub
// at apps/api/src/features/sync). Documented here so the backend/db owner
// can implement the other side without us needing to touch their files.
//
// POST /sync/registrations
// Request body: { registrations: SyncRegistrationPayload[] }
// Response body: { accepted: string[]; rejected: { referenceId: string; reason: string }[] }
// `referenceId` in both request and response is this app's client-generated
// LM-xxxxxx id, used to correlate results back to local queue records.

interface SyncRegistrationPayload {
  referenceId: string;
  fullName: string;
  dateOfBirth: string;
  gender: "female" | "male" | "other";
  phoneNumber: string | null;
  externalReferenceId: string;
  verificationType: "DATE_OF_BIRTH" | "NATIONAL_ID_NUMBER" | "PIN";
  verificationValue: string;
  locationLabel: string;
  coordinates: { latitude: number; longitude: number } | null;
  programmeId: string;
  proxy: {
    fullName: string;
    phoneNumber: string;
    relationship: string;
    nationalId: string | null;
  } | null;
  photoUri: string | null;
  consentGiven: boolean;
  queuedAt: string;
}

interface SyncResponse {
  accepted: string[];
  rejected: Array<{ referenceId: string; reason: string }>;
}

export interface SyncSummary {
  attempted: number;
  synced: number;
  failed: number;
}

const toSyncPayload = (record: QueuedRegistration): SyncRegistrationPayload => ({
  referenceId: record.referenceId,
  fullName: record.fullName,
  dateOfBirth: record.dateOfBirth,
  gender: record.gender,
  phoneNumber: record.hasPhone ? (record.phoneNumber ?? null) : null,
  externalReferenceId: record.externalReferenceId,
  verificationType: record.verificationType,
  verificationValue: record.verificationValue,
  locationLabel: record.locationLabel,
  coordinates: record.coordinates,
  programmeId: record.programmeId,
  proxy: record.hasPhone
    ? null
    : {
        fullName: record.proxyFullName ?? "",
        phoneNumber: record.proxyPhoneNumber ?? "",
        relationship: record.proxyRelationship ?? "",
        nationalId: record.proxyNationalId || null,
      },
  photoUri: record.photoUri,
  consentGiven: record.consentGiven,
  queuedAt: record.queuedAt,
});

let syncInFlight = false;

export const syncPendingRegistrations = async (): Promise<SyncSummary> => {
  if (syncInFlight) return { attempted: 0, synced: 0, failed: 0 };
  syncInFlight = true;

  try {
    const queue = await getQueue();
    const pending = queue.filter((item) => item.syncStatus === "pending" || item.syncStatus === "failed");
    if (pending.length === 0) return { attempted: 0, synced: 0, failed: 0 };

    await Promise.all(pending.map((item) => updateRecord(item.id, { syncStatus: "syncing" })));

    try {
      const response = await apiRequest<SyncResponse>("/sync/registrations", {
        method: "POST",
        body: { registrations: pending.map(toSyncPayload) },
      });

      const rejectedByRef = new Map(response.rejected.map((item) => [item.referenceId, item.reason]));
      let synced = 0;
      let failed = 0;

      for (const item of pending) {
        const rejectionReason = rejectedByRef.get(item.referenceId);
        if (rejectionReason) {
          await updateRecord(item.id, {
            syncStatus: "failed",
            syncError: rejectionReason,
            attempts: item.attempts + 1,
          });
          failed += 1;
        } else {
          await updateRecord(item.id, {
            syncStatus: "synced",
            syncError: null,
            syncedAt: new Date().toISOString(),
            attempts: item.attempts + 1,
          });
          synced += 1;
        }
      }

      return { attempted: pending.length, synced, failed };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Sync server unreachable — will retry automatically";
      await Promise.all(
        pending.map((item) =>
          updateRecord(item.id, { syncStatus: "failed", syncError: message, attempts: item.attempts + 1 }),
        ),
      );
      return { attempted: pending.length, synced: 0, failed: pending.length };
    }
  } finally {
    syncInFlight = false;
  }
};
