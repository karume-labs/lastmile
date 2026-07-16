import { db } from "@lastmile/db/client";
import { auditLogs } from "@lastmile/db/schemas/audit";
import type { NextFunction, Request, Response } from "express";

export const auditLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only log modifying requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    // Intercept response finish to ensure it was successful before logging (or log regardless)
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.id || "anonymous";
        const action = `${req.method} ${req.originalUrl}`;
        const entityType = req.originalUrl.split("/")[2] || "unknown"; // simplistic extraction from /api/:entity/...
        const entityId = req.params.id || "unknown"; // if available

        // Fire and forget audit log insertion
        db.insert(auditLogs)
          .values({
            id: crypto.randomUUID(),
            userId,
            action,
            entityType,
            entityId,
            metadata: JSON.stringify({
              body: req.body,
              query: req.query,
              ip: req.ip,
            }),
          })
          .catch((err) => {
            console.error("Failed to write audit log:", err);
          });
      }
    });
  }

  next();
};
