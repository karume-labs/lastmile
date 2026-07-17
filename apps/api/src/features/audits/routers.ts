import { db } from "@lastmile/db/client";
import { auditLogs } from "@lastmile/db/schemas/audit";
import { desc } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

const auditsRouter = Router();

// GET /api/audits
auditsRouter.get("/", async (_req: Request, res: Response, next) => {
  try {
    const list = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
    res.json({ data: list });
  } catch (error) {
    next(error);
  }
});

export default auditsRouter;
