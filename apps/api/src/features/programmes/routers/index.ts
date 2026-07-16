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
} from "@lastmile/validators/programmes";
import { eq } from "drizzle-orm";
import { Router } from "express";

const router = Router();

// Generate a simple 5-digit OTP for feature phones
const generateOtp = () => Math.floor(10000 + Math.random() * 90000).toString();

// Get active programmes
router.get("/", async (_req, res, next) => {
  try {
    const list = await db.select().from(programmes);
    res.json(list);
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

// Trigger a single disbursement (Usually called in a loop for a batch)
router.post("/disburse", requireRole("admin"), async (req, res, next) => {
  try {
    const { referenceId, amountUsdc } = DisbursementTriggerRequestSchema.parse(req.body);

    const otp = generateOtp();
    // In production, hash this using argon2 or bcrypt before storing
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await db.insert(disbursements).values({
      id: crypto.randomUUID(),
      referenceId,
      amount: amountUsdc,
      status: "pending",
      otpHash,
    });

    const userReg = await db
      .select({
        phoneNumber: identities.phoneNumber,
        preferredLanguage: registrations.preferredLanguage,
      })
      .from(registrations)
      .innerJoin(identities, eq(registrations.identityId, identities.id))
      .where(eq(registrations.referenceId, referenceId))
      .limit(1);

    if (userReg && userReg.length > 0) {
      const { phoneNumber, preferredLanguage } = userReg[0];
      const lang =
        preferredLanguage === "en" || preferredLanguage === "sw" || preferredLanguage === "tu"
          ? preferredLanguage
          : "en";
      await sendDisbursementSms(phoneNumber, referenceId, otp, lang);
    }

    res.json({ success: true, message: "Disbursement queued and OTP generated." });
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

export default router;
