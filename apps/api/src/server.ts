import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import authRouter from "./features/auth/routers";
import syncRouter from "./features/sync/routers";
import ussdSessionRouter from "./features/ussd/routers";
import clawbackRouter from "./features/clawback/routers";
import offrampRouter from "./features/offramp/routers";
import { errorHandler } from "./middlewares/error-handler";

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

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Feature Routers
app.use("/api/auth", authRouter);
app.use("/api/sync", syncRouter);
app.use("/api/ussd", ussdSessionRouter);
app.use("/api/admin", clawbackRouter);
app.use("/api/offramp", offrampRouter);

// Error Handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
