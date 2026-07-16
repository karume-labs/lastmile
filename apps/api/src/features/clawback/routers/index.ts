import { stellarRelayer } from "@lastmile/api/lib/stellar";
import { requireRole } from "@lastmile/api/middlewares/authorize";
import { db } from "@lastmile/db/client";
import { disbursements } from "@lastmile/db/schemas/programmes";
import { ClawbackRequestSchema } from "@lastmile/validators/programmes";
import { eq, or } from "drizzle-orm";
import { Router } from "express";

const router = Router();

/**
 * GET /api/admin/stagnant-funds
 *
 * Queries disbursements where status = 'stagnant' (or pending > 7 days),
 * returns Reference ID, amount, and daysPending.
 */
router.get("/stagnant-funds", requireRole("admin"), async (_req, res, next) => {
  try {
    const list = await db
      .select({
        id: disbursements.id,
        paymentId: disbursements.id,
        referenceId: disbursements.referenceId,
        amount: disbursements.amount,
        currency: disbursements.currency,
        createdAt: disbursements.createdAt,
        participantName: disbursements.participantName,
        programmeName: disbursements.programmeName,
        status: disbursements.status,
      })
      .from(disbursements)
      .where(or(eq(disbursements.status, "stagnant"), eq(disbursements.status, "pending")));

    const now = Date.now();
    const data = list.map((item) => {
      const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : now;
      const daysPending = Math.max(1, Math.floor((now - createdTime) / (1000 * 60 * 60 * 24)));
      return {
        ...item,
        daysPending,
        daysSinceActivity: daysPending,
      };
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/clawback/execute
 *
 * Receives a stagnant payment ID, triggers the Soroban Relayer
 * to execute the contract reversal, and updates the database
 * status to 'clawed_back'.
 */
router.post("/clawback/execute", requireRole("super_admin"), async (req, res, next) => {
  try {
    const { paymentId } = ClawbackRequestSchema.parse(req.body);

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
