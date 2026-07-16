import crypto from "node:crypto";
import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { registrations } from "@lastmile/db/schemas/registration";
import { SyncRequestSchema } from "@lastmile/validators/sync";
import { Router } from "express";

const router = Router();

/**
 * POST /api/sync/push
 *
 * Receives a batch of queued offline registrations from the tablet,
 * splits PII from operational data, and writes them to SQLite.
 */
router.post("/push", async (req, res, next) => {
  try {
    const { records } = SyncRequestSchema.parse(req.body);

    let syncedCount = 0;
    const failedRecords: Array<{ localId?: string; error: string }> = [];

    for (const record of records) {
      try {
        const identityId = crypto.randomUUID();
        const registrationId = crypto.randomUUID();

        // 1. Insert PII into identities table
        await db.insert(identities).values({
          id: identityId,
          fullName: record.fullName,
          phoneNumber: record.phoneNumber,
        });

        // 2. Insert operational data into registrations table
        await db.insert(registrations).values({
          id: registrationId,
          referenceId: record.referenceId,
          identityId: identityId,
          currency: record.currency,
          preferredLanguage: record.preferredLanguage || "en",
          isProxy: record.isProxy || false,
        });

        syncedCount++;
      } catch (err) {
        failedRecords.push({
          localId: record.localId || record.referenceId,
          error: err instanceof Error ? err.message : "Unknown error during sync",
        });
      }
    }

    res.json({
      success: true,
      syncedCount,
      failedRecords,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
