import { db } from "@lastmile/db/client";
import { auditLogs } from "@lastmile/db/schemas/audit";
import type { NextFunction, Request, Response } from "express";

const sanitizeBody = (url: string, body: unknown) => {
  if (url.includes("/bulk-upload") && Array.isArray(body)) {
    return { note: `Bulk upload of ${body.length} records. PII redacted for security.` };
  }
  return body;
};

export const auditLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only log modifying requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    // Intercept response finish to ensure it was successful before logging (or log regardless)
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const actor = req.user?.id || "anonymous";
        const action = `${req.method} ${req.originalUrl}`;
        const target = req.originalUrl.split("/")[2] || "unknown"; // simplistic extraction from /api/:entity/...

        // Fire and forget audit log insertion
        db.insert(auditLogs)
          .values({
            id: crypto.randomUUID(),
            actor,
            action,
            target,
            metadata: JSON.stringify({
              body: sanitizeBody(req.originalUrl, req.body),
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
