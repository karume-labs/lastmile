import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middlewares/auth";
import { disbursementService } from "../services/disbursement.service";

export class DisbursementController {
  async getDeliveries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveries = await disbursementService.getAllDeliveries();
      res.json(deliveries);
    } catch (error) {
      next(error);
    }
  }

  async getStagnantFunds(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stagnant = await disbursementService.getStagnantFunds();
      res.json(stagnant);
    } catch (error) {
      next(error);
    }
  }

  async retrySync(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminUserId = req.user?.id;
      const updated = await disbursementService.retrySync(id, adminUserId);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}

export const disbursementController = new DisbursementController();
