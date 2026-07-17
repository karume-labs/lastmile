import {
  dictionary,
  type SupportedLanguage,
} from "@lastmile/api/features/ussd/services/dictionary";
import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { registrations } from "@lastmile/db/schemas/registration";
import { smsMessages } from "@lastmile/db/schemas/sms";
import { SmsCreateRequestSchema } from "@lastmile/validators/sms";
import { desc, eq } from "drizzle-orm";
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

smsRouter.get("/templates/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    const reg = await db
      .select({ preferredLanguage: registrations.preferredLanguage })
      .from(registrations)
      .innerJoin(identities, eq(registrations.identityId, identities.id))
      .where(eq(identities.phoneNumber, phoneNumber))
      .limit(1);

    let lang: SupportedLanguage = "en";
    if (reg.length > 0) {
      const preferred = reg[0].preferredLanguage;
      if (preferred === "en" || preferred === "sw" || preferred === "tu") {
        lang = preferred;
      }
    }

    const d = dictionary[lang];
    res.json({
      success: true,
      data: {
        language: lang,
        templates: {
          disbursement: d.templateDisbursement,
          sensitization: d.templateSensitization,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch SMS templates" });
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
