<<<<<<< HEAD
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import authRouter from './features/auth/routers';
import programmesRouter from './features/programmes/routers';
import registrationRouter from './features/registration/routers';
import syncRouter from './features/sync/routers';
import { errorHandler } from './middlewares/error-handler';
=======
import auditsRouter from "@lastmile/api/features/audits/routers";
import clawbackRouter from "@lastmile/api/features/clawback/routers";
import dashboardRouter from "@lastmile/api/features/dashboard/routers";
import deliveriesRouter from "@lastmile/api/features/deliveries/routers";
import offrampRouter from "@lastmile/api/features/offramp/routers";
import programmesRouter from "@lastmile/api/features/programmes/routers";
import proxiesRouter from "@lastmile/api/features/proxies/routers";
import registrationRouter from "@lastmile/api/features/registration/routers";
import { smsRouter } from "@lastmile/api/features/sms/routers";
import staffRouter from "@lastmile/api/features/staff/routers";
import syncRouter from "@lastmile/api/features/sync/routers";
import ussdSessionRouter from "@lastmile/api/features/ussd/routers";
import { auditLogMiddleware } from "@lastmile/api/middlewares/audit-log";
import { errorHandler } from "@lastmile/api/middlewares/error-handler";
import { auth } from "@lastmile/auth/options";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
>>>>>>> e782e43cf6d60deb9ebf5bcba084f67166ca8f8f

const PORT = Number(process.env.PORT || "8000");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

// Security and middleware
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth
app.all("/api/auth/*", toNodeHandler(auth));

// Audit Logging (after basic middlewares, before feature routers)
app.use(auditLogMiddleware);

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

<<<<<<< HEAD
app.use('/api/auth', authRouter);
app.use('/api/programmes', programmesRouter);
app.use('/api/registration', registrationRouter);
app.use('/api/sync', syncRouter);

app.use(errorHandler);
=======
// Feature Routers
app.use("/api/sync", syncRouter);
app.use("/api/ussd", ussdSessionRouter);
app.use("/api/admin", clawbackRouter);
app.use("/api/stagnant-funds", clawbackRouter);
app.use("/api/audits", auditsRouter);
app.use("/api/deliveries", deliveriesRouter);
app.use("/api/programmes", programmesRouter);
app.use("/api/offramp", offrampRouter);
app.use("/api/registration", registrationRouter);
app.use("/api/sms", smsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/proxies", proxiesRouter);
app.use("/api/staff", staffRouter);
>>>>>>> e782e43cf6d60deb9ebf5bcba084f67166ca8f8f

// Error Handler (must be last)
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
