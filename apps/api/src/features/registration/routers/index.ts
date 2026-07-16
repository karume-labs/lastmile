import crypto from "node:crypto";
import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { programmes } from "@lastmile/db/schemas/programmes";
import { registrations } from "@lastmile/db/schemas/registration";
import { BulkUploadRequestSchema } from "@lastmile/validators/registration";
import { Router } from "express";
import { z } from "zod/v4";

const router = Router();

router.post("/bulk-upload", async (req, res, next) => {
  try {
    const { programmeTitle, targetCurrency, baseAmount, records } = BulkUploadRequestSchema.parse(req.body);

    const newIdentities: (typeof identities.$inferInsert)[] = [];
    const newRegistrations: (typeof registrations.$inferInsert)[] = [];
    const createdIds: string[] = [];
    const programmeId = crypto.randomUUID();

    // 1. Prepare data in memory
    for (const record of records) {
      const identityId = crypto.randomUUID();
      const referenceId = Math.floor(1000 + Math.random() * 9000).toString();

      newIdentities.push({
        id: identityId,
        fullName: record.fullName,
        phoneNumber: record.phoneNumber,
      });

      newRegistrations.push({
        id: crypto.randomUUID(),
        referenceId,
        identityId,
        programmeId,
        currency: record.currency,
        preferredLanguage: record.preferredLanguage,
        isProxy: record.isProxy,
      });

      createdIds.push(referenceId);
    }

    // 2. Execute queries inside the transaction
    await db.transaction(async (tx) => {
      // Insert the programme
      await tx.insert(programmes).values({
        id: programmeId,
        name: programmeTitle,
        targetCurrency: targetCurrency,
        budget: baseAmount * records.length, // Rough budget based on baseAmount * participants
        status: "Active",
      });

      if (newIdentities.length > 0 && newRegistrations.length > 0) {
        await tx.insert(identities).values(newIdentities);
        await tx.insert(registrations).values(newRegistrations);
      }
    });

    res.json({
      success: true,
      referenceIds: createdIds,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    next(error);
  }
});

export default router;
