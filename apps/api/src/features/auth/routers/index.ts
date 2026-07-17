// Legacy auth router removed. Better Auth is now configured in @lastmile/auth/options
// and mounted directly via toNodeHandler(auth) in server.ts at /api/auth/*
import { Router } from "express";

const router = Router();
export default router;
