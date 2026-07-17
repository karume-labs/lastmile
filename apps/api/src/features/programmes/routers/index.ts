import crypto from "node:crypto";
import { sendDisbursementSms } from "@lastmile/api/lib/sms-client";
import { stellarRelayer } from "@lastmile/api/lib/stellar";
import { requireRole } from "@lastmile/api/middlewares/authorize";
import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { batches, disbursements, programmes } from "@lastmile/db/schemas/programmes";
import { registrations } from "@lastmile/db/schemas/registration";
import {
  ClawbackRequestSchema,
  CreateBatchRequestSchema,
  DisbursementTriggerRequestSchema,
  ProgrammeNotifyRequestSchema,
} from "@lastmile/validators/programmes";
import { and, eq } from "drizzle-orm";
import { Router } from "express";

const router = Router();

// Generate a simple 5-digit OTP for feature phones
const generateOtp = () => Math.floor(10000 + Math.random() * 90000).toString();

// Get active programmes
router.get("/", async (_req, res, next) => {
  try {
    const list = await db.select().from(programmes);
    res.json({ data: list });
  } catch (error) {
    next(error);
  }
});

// Create a disbursement batch & programme
router.post("/batches", async (req, res, next) => {
  try {
    const { programmeName, targetCurrency, batchSize } = CreateBatchRequestSchema.parse(req.body);

    const progId = crypto.randomUUID();
    const batchId = crypto.randomUUID();

    await db.insert(programmes).values({
      id: progId,
      name: programmeName,
      targetCurrency,
      status: "Active",
    });

    await db.insert(batches).values({
      id: batchId,
      programmeId: progId,
      size: batchSize,
      status: "pending",
    });

    res.status(201).json({ success: true, batchId, programmeId: progId });
  } catch (error) {
    next(error);
  }
});

// Trigger a single batch disbursement for a programme
router.post("/disburse", requireRole("admin"), async (req, res, next) => {
  try {
    const { programmeId } = DisbursementTriggerRequestSchema.parse(req.body);

    const prog = await db.select().from(programmes).where(eq(programmes.id, programmeId)).limit(1);
    if (!prog || prog.length === 0) {
      res.status(404).json({ success: false, error: "Programme not found" });
      return;
    }
    const programmeName = prog[0].name;

    const allRegs = await db
      .select({
        referenceId: registrations.referenceId,
        phoneNumber: identities.phoneNumber,
        preferredLanguage: registrations.preferredLanguage,
        participantName: identities.fullName,
        amount: registrations.amount,
      })
      .from(registrations)
      .innerJoin(identities, eq(registrations.identityId, identities.id))
      .where(eq(registrations.programmeId, programmeId));

    if (allRegs.length === 0) {
      res.status(400).json({ success: false, error: "No registrations found for this programme" });
      return;
    }

    const newDisbursements: (typeof disbursements.$inferInsert)[] = [];

    for (const reg of allRegs) {
      const otp = generateOtp();
      // In production, hash this using argon2 or bcrypt before storing
      const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

      newDisbursements.push({
        id: crypto.randomUUID(),
        referenceId: reg.referenceId,
        participantName: reg.participantName,
        programmeName,
        amount: reg.amount,
        status: "pending",
        otpHash,
      });

      // Send SMS asynchronously (fire and forget to not block)
      const lang =
        reg.preferredLanguage === "en" ||
        reg.preferredLanguage === "sw" ||
        reg.preferredLanguage === "tu"
          ? reg.preferredLanguage
          : "en";
      sendDisbursementSms(reg.phoneNumber, reg.referenceId, otp, reg.amount, programmeName, lang).catch(console.error);
    }

    // Insert all disbursements in a single query
    await db.insert(disbursements).values(newDisbursements);

    // Update the pending batch to completed for this programme
    await db
      .update(batches)
      .set({ status: "completed" })
      .where(and(eq(batches.programmeId, programmeId), eq(batches.status, "pending")));

    res.json({ success: true, message: `Disbursed to ${allRegs.length} participants.` });
  } catch (error) {
    next(error);
  }
});

// Admin Clawback Execution
router.post("/clawback/execute", requireRole("super_admin"), async (req, res, next) => {
  try {
    const { paymentId } = ClawbackRequestSchema.parse(req.body);

    // Update status to clawed_back
    const result = await db
      .update(disbursements)
      .set({ status: "clawed_back" })
      .where(eq(disbursements.id, paymentId))
      .returning({ id: disbursements.id });

    if (!result.length) {
      res.status(404).json({ success: false, error: "Disbursement not found." });
      return;
    }

    const { transactionHash } = await stellarRelayer.executeClawback(paymentId);

    res.json({
      success: true,
      message: "Funds successfully clawed back to Treasury.",
      transactionHash,
      status: "clawed_back",
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/programmes/:id/status — toggle programme status
router.patch("/:id/status", requireRole("admin"), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body as { status: "Active" | "Draft" };

    if (!status || !["Active", "Draft"].includes(status)) {
      res.status(400).json({ success: false, error: "Status must be 'Active' or 'Draft'" });
      return;
    }

    const updated = await db
      .update(programmes)
      .set({ status })
      .where(eq(programmes.id, id))
      .returning();

    if (!updated.length) {
      res.status(404).json({ success: false, error: "Programme not found" });
      return;
    }

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/programmes/:id — delete a programme
router.delete("/:id", requireRole("admin"), async (req, res, next) => {
  try {
    const id = String(req.params.id);

    const deleted = await db
      .delete(programmes)
      .where(eq(programmes.id, id))
      .returning({ id: programmes.id });

    if (!deleted.length) {
      res.status(404).json({ success: false, error: "Programme not found" });
      return;
    }

    res.json({ success: true, message: "Programme deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
