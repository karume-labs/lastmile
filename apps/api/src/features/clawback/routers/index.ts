import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticate";

const router = Router();

/**
 * GET /api/admin/stagnant-funds
 *
 * Queries disbursements where status = 'stagnant' (pending > 7 days),
 * joins with registrations to return Reference ID and Phone Number.
 *
 * Response (200):
 * {
 *   "data": [
 *     {
 *       "paymentId": "pay-uuid-444",
 *       "referenceId": "SAP-9942",
 *       "amount": 50.00,
 *       "daysPending": 12
 *     }
 *   ]
 * }
 */
router.get("/stagnant-funds", authenticate, async (_req, res, next) => {
  try {
    // TODO: 1. Query disbursements WHERE status = 'stagnant'
    //    (records pending for > 7 days based on createdAt)
    // TODO: 2. Join with registrations to get referenceId + phoneNumber
    // TODO: 3. Return the enriched list
    res.json({ data: [] });
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
 *
 * Request Body:
 * { "paymentId": "pay-uuid-444" }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "transactionHash": "0xabc123...",
 *   "status": "clawed_back"
 * }
 */
router.post("/clawback/execute", authenticate, async (req, res, next) => {
  try {
    const { paymentId } = req.body;

    // TODO: 1. Look up the disbursement by paymentId
    // TODO: 2. Verify status is 'stagnant'
    // TODO: 3. Call Soroban Relayer to execute on-chain reversal
    // TODO: 4. Update disbursement status to 'clawed_back'
    // TODO: 5. Return the transaction hash
    res.json({
      success: true,
      transactionHash: "",
      status: "clawed_back",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
