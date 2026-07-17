<<<<<<< HEAD
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../../middlewares/authenticate';
import { validate } from '../../../middlewares/validate';
import { syncService } from '../services';

const router = Router();

const updateSyncJobSchema = z.object({
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']),
  errorLog: z.string().optional(),
  attempts: z.number().int().positive().optional(),
});

router.use(authenticate);

router.get('/pending-registrations', async (_req, res, next) => {
  try {
    const registrations = await syncService.listPendingRegistrations();
    res.json({ registrations });
  } catch (error) {
    next(error);
  }
});

router.get('/jobs', async (_req, res, next) => {
  try {
    const jobs = await syncService.listJobs();
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

router.get('/jobs/:id', async (req, res, next) => {
  try {
    const job = await syncService.getJob(req.params.id);

    if (!job) {
      res.status(404).json({ success: false, error: 'Sync job not found' });
      return;
    }

    res.json({ job });
=======
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
>>>>>>> e782e43cf6d60deb9ebf5bcba084f67166ca8f8f
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
router.post('/registrations/:registrationId/retry', async (req, res, next) => {
  try {
    const syncJob = await syncService.retryRegistration(req.params.registrationId);
    res.status(201).json({ syncJob });
  } catch (error) {
    next(error);
  }
});

router.patch('/jobs/:id', validate(updateSyncJobSchema), async (req, res, next) => {
  try {
    const job = await syncService.updateJob(req.params.id, req.body);
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

export default router;
=======
export default router;
>>>>>>> e782e43cf6d60deb9ebf5bcba084f67166ca8f8f
