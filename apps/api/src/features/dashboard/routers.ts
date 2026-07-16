import { type Request, type Response, Router } from "express";

const dashboardRouter = Router();

// GET /api/dashboard/metrics
dashboardRouter.get("/metrics", async (_req: Request, res: Response) => {
  // Mock data for now, eventually query DB
  return res.json({
    data: {
      totalUsers: 1500,
      activeProgrammes: 12,
      totalDisbursed: 4500000,
      recentActivity: [],
    },
  });
});

export default dashboardRouter;
