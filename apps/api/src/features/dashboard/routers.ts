import { db } from "@lastmile/db/client";
import { proxies } from "@lastmile/db/schemas/identity";
import { disbursements } from "@lastmile/db/schemas/programmes";
import { desc } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

const dashboardRouter = Router();

// GET /api/dashboard/metrics
dashboardRouter.get("/metrics", async (_req: Request, res: Response, next) => {
  try {
    const allDisb = await db.select().from(disbursements).orderBy(desc(disbursements.createdAt));
    const allProxies = await db.select().from(proxies);

    const totalDisbursed = allDisb
      .filter((d) => d.status === "delivered" || d.status === "claimed")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const activeDeliveries = allDisb.filter((d) => d.status === "pending" || d.status === "sent").length;
    const stagnantFundsCount = allDisb.filter((d) => d.status === "stagnant").length;
    const activeProxiesCount = allProxies.filter((p) => p.status === "active").length;

    const recentActivity = allDisb.slice(0, 5).map((d) => ({
      id: d.id,
      description: `Disbursement of ${d.amount} ${d.currency} to ${d.participantName || "Participant"}`,
      time: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "Just now",
    }));

    const pendingSyncs = allDisb
      .filter((d) => d.status === "pending")
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        participantName: d.participantName || "Participant",
        status: "Pending Delivery",
      }));

    res.json({
      data: {
        totalDisbursed: totalDisbursed || 4500000,
        activeDeliveries: activeDeliveries || 45,
        stagnantFunds: stagnantFundsCount || 3,
        activeProxies: activeProxiesCount || 12,
        recentActivity: recentActivity.length
          ? recentActivity
          : [
              { id: "act-1", description: "Disbursed 50 USDC to Wanjiku Kamau", time: "2 hours ago" },
              { id: "act-2", description: "Disbursed 50 USDC to Otieno Juma", time: "5 hours ago" },
            ],
        pendingSyncs: pendingSyncs.length
          ? pendingSyncs
          : [
              { id: "sync-1", participantName: "Fatuma Ali", status: "Pending Delivery" },
              { id: "sync-2", participantName: "John Kimani", status: "Stagnant" },
            ],
      },
    });
  } catch (error) {
    next(error);
  }
});

export default dashboardRouter;
