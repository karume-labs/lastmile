import { Router } from "express";
import { requireAdmin } from "../../../middlewares/auth";
import { disbursementController } from "../controllers/disbursement.controller";

const router = Router();

router.get("/deliveries", requireAdmin, (req, res, next) => disbursementController.getDeliveries(req, res, next));
router.get("/stagnant-funds", requireAdmin, (req, res, next) => disbursementController.getStagnantFunds(req, res, next));
router.post("/deliveries/:id/retry", requireAdmin, (req, res, next) => disbursementController.retrySync(req, res, next));

export const disbursementRouter = router;
