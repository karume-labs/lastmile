import { type Request, type Response, Router } from "express";

const proxiesRouter = Router();

// GET /api/proxies
proxiesRouter.get("/", async (_req: Request, res: Response) => {
  // Mock data for now, eventually query DB for identities with isProxy=true or similar
  return res.json({
    data: [
      {
        id: "proxy-1",
        name: "John Doe",
        role: "Field Agent",
        phone: "+254700000001",
        location: "Nairobi",
        participantCount: 45,
        status: "active",
      },
      {
        id: "proxy-2",
        name: "Jane Smith",
        role: "Distributor",
        phone: "+254700000002",
        location: "Mombasa",
        participantCount: 12,
        status: "active",
      },
      {
        id: "proxy-3",
        name: "Alice Kamau",
        role: "Field Agent",
        phone: "+254700000003",
        location: "Kisumu",
        participantCount: 0,
        status: "suspended",
      },
    ],
  });
});

export default proxiesRouter;
