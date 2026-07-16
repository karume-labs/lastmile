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

    const createdIds: string[] = [];

    // Using transaction for safe bulk insert
    await db.transaction(async (tx) => {
      for (const record of records) {
        const identityId = crypto.randomUUID();
        const referenceId = `SAP-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

        await tx.insert(identities).values({
          id: identityId,
          fullName: record.fullName,
        });

        await tx.insert(registrations).values({
          id: crypto.randomUUID(),
          referenceId,
          identityId,
          phoneNumber: record.phoneNumber,
          currency: record.currency,
          isProxy: record.isProxy,
        });

        createdIds.push(referenceId);
      }
    });

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
