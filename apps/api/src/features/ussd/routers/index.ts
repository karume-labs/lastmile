import crypto from "node:crypto";
import { relayerService } from "@lastmile/api/features/relayer/services";
import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { disbursements } from "@lastmile/db/schemas/programmes";
import { registrations } from "@lastmile/db/schemas/registration";
import { and, eq, inArray } from "drizzle-orm";
import { Router } from "express";
import { dictionary, type SupportedLanguage } from "@lastmile/api/features/ussd/services/dictionary";

const router = Router();

router.post("/session", async (req, res, next) => {
  try {
    const { sessionId: _sessionId, phoneNumber, text } = req.body;

    let lang: SupportedLanguage = "en";
    const userReg = await db
      .select({
        identityId: registrations.identityId,
        preferredLanguage: registrations.preferredLanguage,
      })
      .from(registrations)
      .innerJoin(identities, eq(registrations.identityId, identities.id))
      .where(eq(identities.phoneNumber, phoneNumber))
      .limit(1);

    if (!userReg || userReg.length === 0) {
      // Unregistered users get instantly dropped. No menu.
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send(`END ${dictionary.en.unregistered}`);
      return;
    }

    const preferred = userReg[0].preferredLanguage;
    if (preferred === "en" || preferred === "sw" || preferred === "tu") {
      lang = preferred;
    }

    const cleanText = String(text || "").trim();
    const text_parts = cleanText ? cleanText.split("*") : [];
    const step = text_parts.length;

    let response_msg = "";

    if (step === 0) {
      response_msg = `CON ${dictionary[lang].welcome}`;
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send(response_msg);
      return;
    }

    if (step === 1) {
      const option = text_parts[0];
      if (option === "1") {
        response_msg = `CON ${dictionary[lang].enterRef}`;
      } else if (option === "2") {
        response_msg = `CON ${dictionary[lang].selectLang}`;
      } else {
        response_msg = `END ${dictionary[lang].invalidOption}`;
      }
    } else if (step === 2) {
      const option = text_parts[0];
      if (option === "1") {
        const enteredRef = text_parts[1].toUpperCase().trim();
        if (!userReg || userReg.length === 0) {
          response_msg = `END ${dictionary[lang].unregistered}`;
        } else {
          const pendingDisbursements = await db
            .select({
              referenceId: registrations.referenceId,
            })
            .from(registrations)
            .innerJoin(identities, eq(registrations.identityId, identities.id))
            .innerJoin(disbursements, eq(registrations.referenceId, disbursements.referenceId))
            .where(
              and(
                eq(identities.phoneNumber, phoneNumber),
                eq(registrations.referenceId, enteredRef),
                eq(disbursements.status, "pending"),
              ),
            )
            .limit(1);

          if (pendingDisbursements && pendingDisbursements.length > 0) {
            response_msg = `CON ${dictionary[lang].enterOtp}`;
          } else {
            response_msg = `END ${dictionary[lang].invalidRef}`;
          }
        }
      } else if (option === "2") {
        const lang_choice = text_parts[1].trim();
        if (lang_choice === "1" || lang_choice === "2" || lang_choice === "3") {
          const newLang: SupportedLanguage =
            lang_choice === "1" ? "en" : lang_choice === "2" ? "sw" : "tu";
          lang = newLang;

          const whereClause =
            userReg && userReg.length > 0
              ? eq(registrations.identityId, userReg[0].identityId)
              : inArray(
                  registrations.identityId,
                  db
                    .select({ id: identities.id })
                    .from(identities)
                    .where(eq(identities.phoneNumber, phoneNumber)),
                );

          db.update(registrations)
            .set({ preferredLanguage: newLang })
            .where(whereClause)
            .execute()
            .catch(console.error);

          response_msg = `END ${dictionary[lang].langUpdated}`;
        } else {
          response_msg = `END ${dictionary[lang].invalidOption}`;
        }
      } else {
        response_msg = `END ${dictionary[lang].invalidOption}`;
      }
    } else if (step === 3) {
      const option = text_parts[0];
      if (option === "1") {
        const enteredRef = text_parts[1].toUpperCase().trim();
        const enteredOtp = text_parts[2].trim();

        if (!userReg || userReg.length === 0) {
          response_msg = `END ${dictionary[lang].unregistered}`;
        } else {
          const pendingDisbursements = await db
            .select({
              disbursementId: disbursements.id,
              otpHash: disbursements.otpHash,
              amount: disbursements.amount,
            })
            .from(registrations)
            .innerJoin(identities, eq(registrations.identityId, identities.id))
            .innerJoin(disbursements, eq(registrations.referenceId, disbursements.referenceId))
            .where(
              and(
                eq(identities.phoneNumber, phoneNumber),
                eq(registrations.referenceId, enteredRef),
                eq(disbursements.status, "pending"),
              ),
            )
            .limit(1);

          if (pendingDisbursements && pendingDisbursements.length > 0) {
            const record = pendingDisbursements[0];
            const hashedOtp = crypto.createHash("sha256").update(enteredOtp).digest("hex");
            if (record.otpHash === enteredOtp || record.otpHash === hashedOtp) {
              console.log(
                `DEBUG PAYOUT: Authorized KES ${record.amount} for reference ${enteredRef} to ${phoneNumber}`,
              );
              await relayerService.unlockFunds(enteredRef);

              response_msg = `END ${dictionary[lang].successClaim}`;
            } else {
              response_msg = `END ${dictionary[lang].invalidOtp}`;
            }
          } else {
            response_msg = `END ${dictionary[lang].invalidRef}`;
          }
        }
      } else {
        response_msg = `END ${dictionary[lang].invalidOption}`;
      }
    } else {
      response_msg = `END ${dictionary[lang].invalidOption}`;
    }

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(response_msg);
  } catch (error) {
    next(error);
  }
});

export default router;
