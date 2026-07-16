import { dictionary, type SupportedLanguage } from "@lastmile/api/features/ussd/services/dictionary";

// Example mock SMS dispatcher
export const sendDisbursementSms = async (
  phoneNumber: string,
  referenceId: string,
  otp: string,
  lang: SupportedLanguage = "en",
) => {
  // Use the dictionary to format the message dynamically based on user's language
  const message = `${dictionary[lang].successClaim} Ref: ${referenceId}. OTP: ${otp}. Dial *340# to claim.`;

  console.log(`\n💬 [SMS DISPATCH MOCK to ${phoneNumber} (${lang})]:`);
  console.log(`"${message}"\n`);

  // TODO: Replace with actual Africa's Talking POST request
  // await axios.post('https://api.africastalking.com/version1/messaging', ...)
};
