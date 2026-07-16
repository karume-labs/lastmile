import crypto from "node:crypto";
import { requireRole } from "@lastmile/api/middlewares/authorize";
import { db } from "@lastmile/db/client";
import { disbursements } from "@lastmile/db/schemas/programmes";
import { desc, eq } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

const deliveriesRouter = Router();

// GET /api/deliveries
deliveriesRouter.get("/", async (_req: Request, res: Response, next) => {
  try {
    const list = await db.select().from(disbursements).orderBy(desc(disbursements.createdAt));
    res.json({ data: list });
  } catch (error) {
    next(error);
  }
});

// POST /api/deliveries/:id/retry
deliveriesRouter.post("/:id/retry", requireRole("admin"), async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);

    const existing = await db.select().from(disbursements).where(eq(disbursements.id, id)).limit(1);
    if (!existing || existing.length === 0) {
      res.status(404).json({ success: false, error: "Delivery/Disbursement not found" });
      return;
    }

    const updated = await db
      .update(disbursements)
      .set({ status: "pending" })
      .where(eq(disbursements.id, id))
      .returning();

    res.json({ success: true, message: "Delivery retry initiated", data: updated[0] });
  } catch (error) {
    next(error);
  }
});

export default deliveriesRouter;
