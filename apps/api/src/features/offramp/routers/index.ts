import { Router } from "express";

const router = Router();

/**
 * POST /api/offramp/simulate
 *
 * Triggered internally after USSD parser validates the OTP.
 * Reads the user's currency preference, calculates the exchange rate,
 * and simulates the M-Pesa API deposit.
 *
 * Request Body:
 * {
 *   "referenceId": "SAP-9942",
 *   "amountUsdc": 50.00
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "fiatAmount": 6500.00,
 *   "currency": "KES",
 *   "providerReference": "MPESA-XYZ789"
 * }
 */
router.post("/simulate", async (req, res, next) => {
  try {
    const { referenceId: _referenceId, amountUsdc: _amountUsdc } = req.body;

    // TODO: 1. Look up the registration by referenceId
    // TODO: 2. Read the currency preference (e.g., 'KES')
    // TODO: 3. Fetch current USDC/fiat exchange rate
    // TODO: 4. Calculate fiatAmount = amountUsdc * exchangeRate
    // TODO: 5. Simulate M-Pesa STK push / deposit API call
    // TODO: 6. Return the provider reference and fiat details
    res.json({
      success: true,
      fiatAmount: 0,
      currency: "KES",
      providerReference: "",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
