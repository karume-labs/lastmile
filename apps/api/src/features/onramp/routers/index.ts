import { invokeContractOnramp } from "@lastmile/api/lib/stellar";
import { env } from "@lastmile/api/env";
import { db } from "@lastmile/db/client";
import { programmes } from "@lastmile/db/schemas/programmes";
import { eq, sql } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

export const onrampRouter = Router();

onrampRouter.post("/mock", async (req: Request, res: Response) => {
  try {
    const { programmeId, amountKes, mpesaPhoneNumber } = req.body;

    if (!programmeId || !amountKes || !mpesaPhoneNumber) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // 1. Fetch the target program
    const targetProgram = await db.query.programmes.findFirst({
      where: (prog, { eq }) => eq(prog.id, programmeId),
    });

    if (!targetProgram) {
      res.status(404).json({ error: "Programme not found" });
      return;
    }

    // 2. Calculate USDC equivalent
    const amountUsdc = (amountKes / 128.93).toFixed(2);

    // 3. Simulate M-Pesa STK push network latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 4. Call invokeContractOnramp to fund the escrow smart contract
    const onrampResult = await invokeContractOnramp(env.STELLAR_TREASURY_SECRET, parseFloat(amountUsdc));

    if (!onrampResult.success) {
      res.status(500).json({ error: "Failed to fund escrow contract on-chain", details: onrampResult.error });
      return;
    }

    // 5. Update the program's accumulated budget using Drizzle SQL increment
    await db
      .update(programmes)
      .set({
        budget: sql`${programmes.budget} + ${parseFloat(amountUsdc)}`,
      })
      .where(eq(programmes.id, programmeId));

    res.status(200).json({
      success: true,
      amountKes,
      amountUsdc,
      txHash: onrampResult.transactionHash,
    });
  } catch (error) {
    console.error("Mock onramp error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
