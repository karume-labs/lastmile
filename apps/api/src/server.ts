import { env } from "@lastmile/api/env";
import { auth } from "@lastmile/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import ussdGatewayRouter from "./features/ussd-gateway/routers";

const app = express();

// Security and middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// We only need json parsing for our custom endpoints,
// better-auth handles its own body parsing if we pass the raw request.
// Wait, toNodeHandler handles it seamlessly, but if we mount express.json() globally,
// it might consume the stream. express.json() is fine for better-auth too.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import type { Request, Response } from "express";

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Better Auth Mount
app.all("/api/auth/*", toNodeHandler(auth.handler));

// USSD Gateway Mount
app.use("/api/v1/ussd", ussdGatewayRouter);

// Start server
app.listen(env.PORT, () => {
  console.log(`Express API running on http://localhost:${env.PORT}`);
});
