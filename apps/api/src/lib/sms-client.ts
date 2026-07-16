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
  lang: SupportedLanguage = "en",
) => {
  // Use the dictionary to format the message dynamically based on user's language
  const message = `${dictionary[lang].successClaim} Ref: ${referenceId}. OTP: ${otp}. Dial *340# to claim.`;

  console.log(`\n💬 [SMS DISPATCH to ${phoneNumber} (${lang})]:`);
  console.log(`"${message}"\n`);

  // Call the Africa's Talking service directly
  await dispatchAlert(phoneNumber, message);
};

export const sendConfirmationSms = async (
  phoneNumber: string,
  amount: number,
  referenceId: string,
  lang: SupportedLanguage = "en",
) => {
  // Use the dictionary's successClaim message
  const message = `${dictionary[lang].successClaim} Ref: ${referenceId}. Amount: ${amount}`;

  console.log(`\n💬 [SMS DISPATCH (CONFIRMATION) to ${phoneNumber} (${lang})]:`);
  console.log(`"${message}"\n`);

  await dispatchAlert(phoneNumber, message);
};
