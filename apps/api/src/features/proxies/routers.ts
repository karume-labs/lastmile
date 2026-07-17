import { requireRole } from "@lastmile/api/middlewares/authorize";
import { db } from "@lastmile/db/client";
import { proxies } from "@lastmile/db/schemas/identity";
import { desc, eq } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

const proxiesRouter = Router();

// GET /api/proxies
proxiesRouter.get("/", async (_req: Request, res: Response, next) => {
  try {
    const list = await db.select().from(proxies).orderBy(desc(proxies.createdAt));
    return res.json({ data: list });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/proxies/:id/status — suspend or restore a proxy
proxiesRouter.patch(
  "/:id/status",
  requireRole("admin"),
  async (req: Request, res: Response, next) => {
    try {
      const id = String(req.params.id);
      const { status } = req.body as { status: "active" | "suspended" };

      if (!status || !["active", "suspended"].includes(status)) {
        res.status(400).json({ success: false, error: "Status must be 'active' or 'suspended'" });
        return;
      }

      const updated = await db
        .update(proxies)
        .set({ status })
        .where(eq(proxies.id, id))
        .returning();

      if (!updated.length) {
        res.status(404).json({ success: false, error: "Proxy not found" });
        return;
      }

      res.json({ success: true, data: updated[0] });
    } catch (error) {
      next(error);
    }
  },
);

export default proxiesRouter;
