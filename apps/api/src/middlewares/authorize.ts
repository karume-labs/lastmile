import type { NextFunction, Request, Response } from "express";

export type Role = "super_admin" | "admin" | "registrar";

const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 3,
  admin: 2,
  registrar: 1,
};

const normalizeRole = (role?: string | null): Role => {
  if (!role) return "registrar";
  const normalized = role.toLowerCase().replace(/-/g, "_");
  if (normalized === "super_admin" || normalized === "admin" || normalized === "registrar") {
    return normalized as Role;
  }
  return "registrar";
};

// Example usage: router.post("/disburse", requireRole("admin"), handler...)
export const requireRole = (minimumRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming authenticate middleware populates req.user via better-auth
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = normalizeRole(user.role);

    // Check if the user's role weight is >= the required role weight
    if (ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole]) {
      next();
      return;
    }

    res.status(403).json({
      error: `Forbidden. Requires ${minimumRole} privileges.`,
    });
  };
};
