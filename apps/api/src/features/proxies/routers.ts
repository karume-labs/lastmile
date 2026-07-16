import { db } from "@lastmile/db/client";
import { proxies } from "@lastmile/db/schemas/identity";
import { desc } from "drizzle-orm";
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

export default proxiesRouter;
