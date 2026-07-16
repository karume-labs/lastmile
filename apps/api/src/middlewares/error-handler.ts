// src/middlewares/error-handler.ts
import type { NextFunction, Request, Response } from "express";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  const status = (err as { status?: number }).status || 500;
  const message = (err as { message?: string }).message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
};
