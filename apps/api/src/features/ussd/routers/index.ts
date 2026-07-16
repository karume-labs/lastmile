import { db } from "@lastmile/db/client";
import { identities } from "@lastmile/db/schemas/identity";
import { registrations } from "@lastmile/db/schemas/registration";
import { eq } from "drizzle-orm";
import { Router } from "express";

const router = Router();

type Language = "en" | "sw";

const MOCK_BENEFICIARIES: Record<
  string,
  { name: string; phone: string; otp: string; amount: number; is_proxy: boolean }
> = {
  "1024": { name: "John", phone: "+254712345678", otp: "58210", amount: 15000, is_proxy: false },
  "5500": { name: "Mary", phone: "+254799887766", otp: "11223", amount: 25000, is_proxy: true },
  "9900": { name: "Joseph", phone: "+254799887766", otp: "44556", amount: 18000, is_proxy: true },
};

const STRINGS = {
  en: {
    welcome: "CON Welcome to LastMile.\nSelect Language:\n1. English\n2. Kiswahili",
    enter_ref: "CON Enter your 4-digit Reference ID:",
    enter_otp: "CON Enter the active Transaction OTP sent to your phone:",
    select_user: "CON Multiple users found on this phone. Select your name:\n",
    confirm_payout: "CON Withdraw {amount} KES to phone {phone}?\n1. Confirm\n2. Cancel",
    authorized: "END Payout of {amount} KES authorized! Funds are being sent to your mobile wallet.",
    cancelled: "END Transaction cancelled.",
    err_ref: "END Error: Reference ID not found.",
    err_otp: "END Error: Invalid Verification OTP.",
    invalid_opt: "END Invalid selection.",
  },
  sw: {
    welcome: "CON Karibu LastMile.\nChagua Lugha:\n1. English\n2. Kiswahili",
    enter_ref: "CON Weka Nambari yako ya Ushahidi (Ref ID):",
    enter_otp: "CON Weka nambari ya siri (OTP) uliyotumiwa kwa SMS:",
    select_user: "CON Chagua jina lako kwenye orodha:\n",
    confirm_payout: "CON Kubali kutoa KES {amount} kwenda nambari {phone}?\n1. Kubali\n2. Ghairi",
    authorized: "END Malipo ya KES {amount} yamekubaliwa! Fedha zinatumwa kwenye simu yako hivi punde.",
    cancelled: "END Shughuli imenghairiwa.",
    err_ref: "END Makosa: Nambari ya Ushahidi haipatikani.",
    err_otp: "END Makosa: Nambari ya siri (OTP) sio sawa.",
    invalid_opt: "END Chaguo si sahihi.",
  },
} as const;

function formatString(template: string, values: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return typeof values[key] !== "undefined" ? String(values[key]) : match;
  });
}

router.post("/session", async (req, res, next) => {
  try {
    const { sessionId: _sessionId, phoneNumber, text } = req.body;

    let lang: Language = "en";
    const userReg = await db
      .select({ preferredLanguage: registrations.preferredLanguage })
      .from(registrations)
      .innerJoin(identities, eq(registrations.identityId, identities.id))
      .where(eq(identities.phoneNumber, phoneNumber))
      .limit(1);

    if (userReg && userReg.length > 0) {
      const preferred = userReg[0].preferredLanguage;
      if (preferred === "sw") {
        lang = "sw";
      }
    }

    const cleanText = String(text || "").trim();
    const text_parts = cleanText ? cleanText.split("*") : [];
    const step = text_parts.length;

    let response_msg = "";

    if (step === 0) {
      response_msg = STRINGS.en.welcome;
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send(response_msg);
      return;
    }

    const lang_choice = text_parts[0];
    if (lang_choice === "2") {
      lang = "sw";
    } else {
      lang = "en";
    }

    const matching_accounts = Object.fromEntries(
      Object.entries(MOCK_BENEFICIARIES).filter(([_, v]) => v.phone === phoneNumber)
    );
    const matching_keys = Object.keys(matching_accounts);
    const matching_len = matching_keys.length;

    if (step === 1) {
      if (matching_len === 0) {
        response_msg = STRINGS[lang].enter_ref;
      } else if (matching_len === 1) {
        response_msg = STRINGS[lang].enter_otp;
      } else {
        let menu = STRINGS[lang].select_user;
        matching_keys.forEach((ref, index) => {
          const idx = index + 1;
          const acc = matching_accounts[ref];
          menu += `${idx}. ${acc.name}\n`;
        });
        response_msg = menu.trim();
      }
    } else if (step === 2) {
      const userInput = text_parts[1];

      if (matching_len === 0) {
        const enteredRef = userInput.toUpperCase();
        if (MOCK_BENEFICIARIES[enteredRef]) {
          response_msg = STRINGS[lang].enter_otp;
        } else {
          response_msg = STRINGS[lang].err_ref;
        }
      } else if (matching_len === 1) {
        const refId = matching_keys[0];
        const record = MOCK_BENEFICIARIES[refId];
        if (record.otp === userInput) {
          response_msg = formatString(STRINGS[lang].confirm_payout, {
            amount: record.amount,
            phone: phoneNumber,
          });
        } else {
          response_msg = STRINGS[lang].err_otp;
        }
      } else {
        const selectedIndex = parseInt(userInput, 10) - 1;
        if (!Number.isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < matching_len) {
          response_msg = STRINGS[lang].enter_otp;
        } else {
          response_msg = STRINGS[lang].invalid_opt;
        }
      }
    } else if (step === 3) {
      const userInput = text_parts[2];

      if (matching_len === 0) {
        const refId = text_parts[1].toUpperCase();
        const record = MOCK_BENEFICIARIES[refId];
        if (record && record.otp === userInput) {
          response_msg = formatString(STRINGS[lang].confirm_payout, {
            amount: record.amount,
            phone: phoneNumber,
          });
        } else {
          response_msg = STRINGS[lang].err_otp;
        }
      } else if (matching_len === 1) {
        const refId = matching_keys[0];
        const record = MOCK_BENEFICIARIES[refId];
        if (userInput === "1") {
          response_msg = formatString(STRINGS[lang].authorized, {
            amount: record.amount,
          });
        } else {
          response_msg = STRINGS[lang].cancelled;
        }
      } else {
        const selectedIndex = parseInt(text_parts[1], 10) - 1;
        if (!Number.isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < matching_len) {
          const refId = matching_keys[selectedIndex];
          const record = MOCK_BENEFICIARIES[refId];
          if (record.otp === userInput) {
            response_msg = formatString(STRINGS[lang].confirm_payout, {
              amount: record.amount,
              phone: phoneNumber,
            });
          } else {
            response_msg = STRINGS[lang].err_otp;
          }
        } else {
          response_msg = STRINGS[lang].invalid_opt;
        }
      }
    } else if (step === 4) {
      const userInput = text_parts[3];
      let refId: string | null = null;

      if (matching_len === 0) {
        refId = text_parts[1].toUpperCase();
      } else {
        const selectedIndex = parseInt(text_parts[1], 10) - 1;
        if (!Number.isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < matching_len) {
          refId = matching_keys[selectedIndex];
        }
      }

      const record = refId ? MOCK_BENEFICIARIES[refId] : null;
      if (userInput === "1" && record) {
        console.log(`DEBUG PAYOUT: Sending KES ${record.amount} to ${phoneNumber}...`);
        response_msg = formatString(STRINGS[lang].authorized, {
          amount: record.amount,
        });
      } else {
        response_msg = STRINGS[lang].cancelled;
      }
    }

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(response_msg);
  } catch (error) {
    next(error);
  }
});

export default router;
