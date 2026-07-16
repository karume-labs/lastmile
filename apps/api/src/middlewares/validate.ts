// src/middlewares/validate.ts
import type { NextFunction, Request, Response } from "express";
import { type ZodSchema, z } from "zod/v4";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation Error",
          details: error.issues,
        });
        return;
      }
      res.status(400).json({
        success: false,
        error: "Validation Error",
        details: (error as { message?: string }).message ?? "Unknown error",
      });
    }
  };
};
