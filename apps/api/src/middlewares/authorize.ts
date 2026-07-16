import type { NextFunction, Request, Response } from "express";

export const requirePermission = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // We will populate req.user from better-auth in the top level middleware
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = user.role;

    // Simplistic permission check based on role for now
    if (userRole === "super-admin") {
      next();
      return;
    }

    if (userRole === "registrar") {
      // Logic for registrar permissions
      if (action.startsWith("read") || action === "register_user") {
        next();
        return;
      }
    }

    res.status(403).json({ error: "Forbidden" });
    return;
  };
};
