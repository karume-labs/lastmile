import crypto from "node:crypto";
import { db } from "@lastmile/db/client";
import { smsMessages } from "@lastmile/db/schemas/sms";
import { SmsCreateRequestSchema } from "@lastmile/validators/sms";
import { desc } from "drizzle-orm";
import { Router } from "express";
import { dispatchAndTrackAlert } from "../services/notifications";

export const smsRouter = Router();

smsRouter.get("/", async (_req, res) => {
  try {
    const messages = await db.select().from(smsMessages).orderBy(desc(smsMessages.createdAt));
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch SMS messages" });
  }
});

smsRouter.post("/", async (req, res) => {
  try {
    const result = SmsCreateRequestSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error.issues });
      return;
    }

    const { recipient, content } = result.data;

    const response = await dispatchAndTrackAlert(recipient, content);

    res.json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create SMS message" });
  }
});
