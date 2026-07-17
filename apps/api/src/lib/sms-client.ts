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
  programName: string,
  lang: SupportedLanguage = "en",
) => {
  const getMessage = () => {
    switch (lang) {
      case "sw":
        return `LastMile: Umepokea Ksh ${amount} kutoka kwa mradi wa ${programName}. Namba yako ya kumbukumbu (Ref) ni ${referenceId}. OTP yako ni ${otp}. Piga *340# kudai.`;
      case "tu":
        return `LastMile: Iyokino Ksh ${amount} an program a ${programName}. Ref kon nge ${referenceId}. OTP nge ${otp}. Piga *340# kudai.`;
      case "en":
      default:
        return `LastMile: You have received Ksh ${amount} from the ${programName} program. Your Ref ID is ${referenceId}. Your OTP is ${otp}. Dial *340# to claim.`;
    }
  };

  const message = getMessage();

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
  const message = `${dictionary[lang].successClaim} Ref: ${referenceId}. Ksh ${amount}`;

  console.log(`\n💬 [SMS DISPATCH (CONFIRMATION) to ${phoneNumber} (${lang})]:`);
  console.log(`"${message}"\n`);

  await dispatchAlert(phoneNumber, message);
};
