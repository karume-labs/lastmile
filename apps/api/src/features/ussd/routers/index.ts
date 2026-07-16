import { Router } from "express";

const router = Router();

/**
 * POST /api/ussd/session
 *
 * Parses incoming USSD strings from the telco aggregator.
 * Extracts phoneNumber, queries registrations to verify authorization,
 * and extracts the Reference ID + OTP from the text payload.
 *
 * Request Body (JSON or Form Data from aggregator):
 * {
 *   "sessionId": "AT-123456",
 *   "phoneNumber": "+254700000000",
 *   "text": "SAP-9942*849201"
 * }
 *
 * Response (200 - Plain Text):
 * CON Verification successful. Funds are being routed to your mobile money account.
 */
router.post("/session", async (req, res, next) => {
  try {
    const { sessionId, phoneNumber, text } = req.body;

    // TODO: 1. Parse the USSD text string to extract referenceId and OTP
    // TODO: 2. Query registrations table by phoneNumber to verify the user is authorized
    // TODO: 3. Validate the OTP against the stored hash in disbursements
    // TODO: 4. If valid, trigger the off-ramp flow
    // TODO: 5. Return appropriate USSD response string

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("CON Processing your request...");
  } catch (error) {
    next(error);
  }
});

export default router;
