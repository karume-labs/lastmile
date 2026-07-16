import crypto from "node:crypto";
import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { registrations } from "@lastmile/db/schemas/registration";
import { BulkUploadRequestSchema } from "@lastmile/validators/registration";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.post("/bulk-upload", async (req, res, next) => {
  try {
    const records = BulkUploadRequestSchema.parse(req.body);

    const newIdentities: (typeof identities.$inferInsert)[] = [];
    const newRegistrations: (typeof registrations.$inferInsert)[] = [];
    const createdIds: string[] = [];

    // 1. Prepare data in memory
    for (const record of records) {
      const identityId = crypto.randomUUID();
      const referenceId = `SAP-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

      newIdentities.push({
        id: identityId,
        fullName: record.fullName,
        phoneNumber: record.phoneNumber,
      });

      newRegistrations.push({
        id: crypto.randomUUID(),
        referenceId,
        identityId,
        currency: record.currency,
        preferredLanguage: record.preferredLanguage,
        isProxy: record.isProxy,
      });

      createdIds.push(referenceId);
    }

    // 2. Execute exactly 2 queries inside the transaction
    if (newIdentities.length > 0 && newRegistrations.length > 0) {
      await db.transaction(async (tx) => {
        await tx.insert(identities).values(newIdentities);
        await tx.insert(registrations).values(newRegistrations);
      });
    }

    res.json({
      success: true,
      referenceIds: createdIds,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    next(error);
  }
});

export default router;
