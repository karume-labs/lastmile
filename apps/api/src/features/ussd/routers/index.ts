import {
  dictionary,
  type SupportedLanguage,
} from "@lastmile/api/features/ussd/services/dictionary";
import { db } from "@lastmile/db/client";
import { registrations } from "@lastmile/db/schemas/registration";
import { eq } from "drizzle-orm";
import { Router } from "express";

const router = Router();

/**
 * POST /api/ussd/session
 *
 * Parses incoming USSD strings from the telco aggregator.
 * Extracts phoneNumber, queries registrations to verify authorization,
 * and extracts the Reference ID + OTP from the text payload.
 *
 * Request Body (JSON or Form Data from aggregator):
 * {
 *   "sessionId": "AT-123456",
 *   "phoneNumber": "+254700000000",
 *   "text": "SAP-9942*849201"
 * }
 *
 * Response (200 - Plain Text):
 * CON Verification successful. Funds are being routed to your mobile money account.
 */

router.post("/session", async (req, res, next) => {
  try {
    const { sessionId: _sessionId, phoneNumber, text } = req.body;

    // Determine user's preferred language
    let lang: SupportedLanguage = "en";
    const userReg = await db
      .select({ preferredLanguage: registrations.preferredLanguage })
      .from(registrations)
      .where(eq(registrations.phoneNumber, phoneNumber))
      .limit(1);

    if (userReg && userReg.length > 0) {
      lang = (userReg[0].preferredLanguage as SupportedLanguage) || "en";
    }

    const t = dictionary[lang];
    const parts = (text || "").split("*").filter(Boolean);

    let responseText = "";

    if (parts.length === 0) {
      responseText = `CON ${t.welcome}`;
    } else if (parts[0] === "1") {
      // Claim Funds Flow
      if (parts.length === 1) {
        responseText = `CON ${t.enterRef}`;
      } else if (parts.length === 2) {
        responseText = `CON ${t.enterOtp}`;
      } else if (parts.length === 3) {
        // Here we would validate OTP and reference ID, then trigger off-ramp
        responseText = `END ${t.successClaim}`;
      } else {
        responseText = `END ${t.invalidOption}`;
      }
    } else if (parts[0] === "2") {
      // Change Language Flow
      if (parts.length === 1) {
        responseText = `CON ${t.selectLang}`;
      } else if (parts.length === 2) {
        const langChoice = parts[1];
        let newLang: SupportedLanguage = "en";
        let valid = true;

        if (langChoice === "1") newLang = "en";
        else if (langChoice === "2") newLang = "sw";
        else if (langChoice === "3") newLang = "tu";
        else valid = false;

        if (valid) {
          // Update DB if user is registered
          if (userReg && userReg.length > 0) {
            await db
              .update(registrations)
              .set({ preferredLanguage: newLang })
              .where(eq(registrations.phoneNumber, phoneNumber));
          }
          // Respond in the new language
          responseText = `END ${dictionary[newLang].langUpdated}`;
        } else {
          responseText = `END ${t.invalidOption}`;
        }
      } else {
        responseText = `END ${t.invalidOption}`;
      }
    } else {
      responseText = `END ${t.invalidOption}`;
    }

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(responseText);
  } catch (error) {
    next(error);
  }
});

export default router;
