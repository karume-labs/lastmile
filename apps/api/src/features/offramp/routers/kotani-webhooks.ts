import { db } from "@lastmile/db/client";
import { disbursements } from "@lastmile/db/schemas/programmes";
import { eq } from "drizzle-orm";
import { type Request, type Response, Router } from "express";
import { env } from "@lastmile/api/env";
import crypto from "node:crypto";

export const kotaniWebhooksRouter = Router();

kotaniWebhooksRouter.post("/", async (req: Request, res: Response) => {
  try {
    const rawHeader = req.headers["x-signature"] || req.headers["x-kotani-signature"];
    const signatureStr = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    
    if (!signatureStr) {
      res.status(401).json({ error: "Missing signature header" });
      return;
    }

    // Verify the signature
    const payloadString = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", env.KOTANI_WEBHOOK_SECRET || "")
      .update(payloadString)
      .digest("hex");

    if (signatureStr.length !== expectedSignature.length) {
      res.status(401).json({ error: "Invalid signature structural length" });
      return;
    }

    // Use timingSafeEqual to prevent timing attacks
    const isVerified = crypto.timingSafeEqual(
      Buffer.from(signatureStr),
      Buffer.from(expectedSignature)
    );

    if (!isVerified) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

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
