import { db } from "@lastmile/db/client";
import { registrations } from "@lastmile/db/schemas/registration";
import { OfframpSimulateRequestSchema } from "@lastmile/validators/offramp";
import { eq } from "drizzle-orm";
import { Router } from "express";

const router = Router();

// Mock exchange rates (USDC to local fiat)
const EXCHANGE_RATES: Record<string, number> = {
  KES: 130.5,
  NGN: 1500.0,
  GHS: 14.2,
  USD: 1.0,
};

router.post("/simulate", async (req, res, next) => {
  try {
    const { referenceId, amountUsdc } = OfframpSimulateRequestSchema.parse(req.body);

    // 1. Look up the registration to get the currency
    const userReg = await db
      .select({ currency: registrations.currency })
      .from(registrations)
      .where(eq(registrations.referenceId, referenceId))
      .limit(1);

    if (!userReg.length) {
      res.status(404).json({ success: false, error: "Registration not found." });
      return;
    }

    const currency = userReg[0].currency;
    const rate = EXCHANGE_RATES[currency] || 1;

    // 2. Calculate the fiat amount
    const fiatAmount = parseFloat((amountUsdc * rate).toFixed(2));

    // 3. Simulate the Kotani Pay / M-Pesa B2C response
    res.json({
      success: true,
      fiatAmount,
      currency,
      exchangeRateApplied: rate,
      providerReference: `KOTANI-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
