import { db } from "@lastmile/db/client";
import { user } from "@lastmile/db/schemas/auth";
import { inArray } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

const staffRouter = Router();

// GET /api/staff
staffRouter.get("/", async (_req: Request, res: Response) => {
  const staffMembers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(inArray(user.role, ["admin", "staff"]));

  return res.json({ data: staffMembers });
});

export default staffRouter;
