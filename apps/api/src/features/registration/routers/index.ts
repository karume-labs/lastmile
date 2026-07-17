import crypto from "node:crypto";
import { requireRole } from "@lastmile/api/middlewares/authorize";
import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { programmes } from "@lastmile/db/schemas/programmes";
import { registrations } from "@lastmile/db/schemas/registration";
import { BulkUploadRequestSchema } from "@lastmile/validators/registration";
import { eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod/v4";

const router = Router();

router.post("/bulk-upload", async (req, res, next) => {
  try {
    const { programmeTitle, targetCurrency, baseAmount, records } = BulkUploadRequestSchema.parse(
      req.body,
    );

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
        amount: record.amount,
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

router.get("/", requireRole("admin"), async (_req, res, next) => {
  try {
    const participants = await db
      .select({
        id: identities.id,
        fullName: identities.fullName,
        phoneNumber: identities.phoneNumber,
        failedAttempts: identities.failedAttempts,
        lockoutUntil: identities.lockoutUntil,
        ussdBlocked: identities.ussdBlocked,
        referenceId: registrations.referenceId,
      })
      .from(identities)
      .innerJoin(registrations, eq(identities.id, registrations.identityId));

    res.json({ success: true, data: participants });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/unblock", requireRole("admin"), async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);

    const updated = await db
      .update(identities)
      .set({ ussdBlocked: false, failedAttempts: 0, lockoutUntil: null })
      .where(eq(identities.id, id))
      .returning();

    if (!updated.length) {
      res.status(404).json({ success: false, error: "Participant not found" });
      return;
    }

    res.json({ success: true, message: "Participant unblocked successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
