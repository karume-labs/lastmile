import { dispatchAlert } from "@lastmile/api/features/sms/services/notifications";
import {
  dictionary,
  type SupportedLanguage,
} from "@lastmile/api/features/ussd/services/dictionary";

// Actual SMS dispatcher using Africa's Talking
export const sendDisbursementSms = async (
  phoneNumber: string,
  referenceId: string,
  otp: string,
  amount: number,
  lang: SupportedLanguage = "en",
) => {
  const d = dictionary[lang];
  const message = `${d.successClaim} ${d.refLabel}: ${referenceId}. ${d.amountLabel}: ${amount}. ${d.otpLabel}: ${otp}. ${d.dialToClaim}`;

  console.log(`\n💬 [SMS DISPATCH to ${phoneNumber} (${lang})]:`);
  console.log(`"${message}"\n`);

  await dispatchAlert(phoneNumber, message);
};

export const sendConfirmationSms = async (
  phoneNumber: string,
  amount: number,
  referenceId: string,
  lang: SupportedLanguage = "en",
) => {
  const d = dictionary[lang];
  const message = `${d.successClaim} ${d.refLabel}: ${referenceId}. ${d.amountLabel}: ${amount}`;

  console.log(`\n💬 [SMS DISPATCH (CONFIRMATION) to ${phoneNumber} (${lang})]:`);
  console.log(`"${message}"\n`);

  await dispatchAlert(phoneNumber, message);
};
