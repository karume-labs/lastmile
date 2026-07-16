// src/middlewares/validate.ts
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        error: "Validation Error",
        details: (error as { errors?: unknown }).errors ?? (error as { message?: string }).message,
      });
    }
  };
};
