import { Router } from "express";

const router = Router();

/**
 * POST /api/sync/push
 *
 * Receives a batch of queued offline registrations from the tablet,
 * splits PII from operational data, and writes them to SQLite.
 *
 * Request Body:
 * {
 *   "records": [
 *     {
 *       "localId": "uuid-123",
 *       "fullName": "John Doe",
 *       "referenceId": "SAP-9942",
 *       "phoneNumber": "+254700000000",
 *       "currency": "KES",
 *       "isProxy": true
 *     }
 *   ]
 * }
 *
 * Response (200):
 * { "success": true, "syncedCount": 1, "failedRecords": [] }
 */
router.post("/push", async (req, res, next) => {
  try {
    // TODO: 1. Validate req.body.records with Zod
    // TODO: 2. For each record, insert PII into identities table
    // TODO: 3. Insert operational data into registrations table
    // TODO: 4. Collect any failures and return them
    res.json({
      success: true,
      syncedCount: 0,
      failedRecords: [],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
