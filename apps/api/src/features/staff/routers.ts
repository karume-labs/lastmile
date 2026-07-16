import { requireRole } from "@lastmile/api/middlewares/authorize";
import { db } from "@lastmile/db/client";
import { user } from "@lastmile/db/schemas/auth";
import { ToggleBanSchema, UpdateStaffSchema } from "@lastmile/validators/staff";
import { eq, inArray } from "drizzle-orm";
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

// PATCH /api/staff/:id
staffRouter.patch("/:id", requireRole("super_admin"), async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const validated = UpdateStaffSchema.parse(req.body);

    const updateData: Partial<{ name: string; role: string }> = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.role !== undefined) updateData.role = validated.role;

    if (Object.keys(updateData).length > 0) {
      const updated = await db
        .update(user)
        .set(updateData)
        .where(eq(user.id, id))
        .returning();

      if (!updated || updated.length === 0) {
        res.status(404).json({ success: false, error: "Staff member not found" });
        return;
      }
      res.json({ success: true, data: updated[0] });
      return;
    }

    const existing = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, id));

    if (!existing || existing.length === 0) {
      res.status(404).json({ success: false, error: "Staff member not found" });
      return;
    }

    return res.json({ success: true, data: existing[0] });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/staff/:id/ban
staffRouter.patch("/:id/ban", requireRole("super_admin"), async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const { banned } = ToggleBanSchema.parse(req.body);

    const updated = await db
      .update(user)
      .set({ banned })
      .where(eq(user.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      res.status(404).json({ success: false, error: "Staff member not found" });
      return;
    }

    return res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

export default staffRouter;
