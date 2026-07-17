import { db } from "@lastmile/db/client";
import { disbursements } from "@lastmile/db/schemas/programmes";
import { eq } from "drizzle-orm";
import { type Request, type Response, Router } from "express";
// In a real implementation, you would use KOTANI_WEBHOOK_SECRET to verify signatures.
// import { env } from "@lastmile/api/env";

export const kotaniWebhooksRouter = Router();

kotaniWebhooksRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { reference, status, transactionId, blockchainHash } = req.body;

    if (!reference || !status) {
      res.status(400).json({ error: "Missing reference or status" });
      return;
    }

    if (status === "SUCCESS") {
      await db
        .update(disbursements)
        .set({ status: "completed", txHash: blockchainHash })
        .where(eq(disbursements.referenceId, reference));
    } else if (status === "FAILED") {
      await db
        .update(disbursements)
        .set({ status: "failed" })
        .where(eq(disbursements.referenceId, reference));
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Kotani webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
