export type SupportedLanguage = "en" | "sw" | "tu";

type DictionaryKeys =
  | "welcome"
  | "enterRef"
  | "enterOtp"
  | "successClaim"
  | "selectLang"
  | "langUpdated"
  | "invalidOption"
  | "unregistered"
  | "invalidRef"
  | "invalidOtp"
  | "accountBlocked"
  | "tryAgainLater";

export const dictionary: Record<SupportedLanguage, Record<DictionaryKeys, string>> = {
  en: {
    welcome: "Welcome to LastMile.\n1. Claim Funds\n2. Change Language",
    enterRef: "Enter your Reference ID:",
    enterOtp: "Enter your OTP:",
    successClaim: "Verification successful. Funds are being routed to your mobile money account.",
    selectLang: "Select Language:\n1. English\n2. Swahili\n3. Turkana",
    langUpdated: "Language updated successfully.",
    invalidOption: "Invalid option selected.",
    unregistered: "Your phone number is not registered.",
    invalidRef: "Invalid Reference ID.",
    invalidOtp: "Invalid OTP.",
    accountBlocked:
      "Your account is permanently blocked due to too many failed attempts. Contact Admin.",
    tryAgainLater: "Too many failed attempts. Please wait {seconds} seconds and try again.",
  },
  sw: {
    welcome: "Karibu LastMile.\n1. Dai Pesa\n2. Badilisha Lugha",
    enterRef: "Ingiza Namba yako ya Kumbukumbu (Reference ID):",
    enterOtp: "Ingiza OTP yako:",
    successClaim: "Uhakiki umefaulu. Pesa zinatumwa kwenye akaunti yako ya simu.",
    selectLang: "Chagua Lugha:\n1. Kiingereza\n2. Kiswahili\n3. Kiturkana",
    langUpdated: "Lugha imebadilishwa kikamilifu.",
    invalidOption: "Chaguo batili.",
    unregistered: "Namba yako ya simu haijasajiliwa.",
    invalidRef: "Namba ya Kumbukumbu batili.",
    invalidOtp: "OTP batili.",
    accountBlocked:
      "Akaunti yako imefungwa kwa sababu ya majaribio mengi yaliyoshindwa. Wasiliana na msimamizi.",
    tryAgainLater:
      "Majaribio mengi yameshindwa. Tafadhali subiri sekunde {seconds} kisha ujaribu tena.",
  },
  tu: {
    welcome: "Yokak LastMile.\n1. Ng'alakin Ng'aropiyen\n2. Ng'alakin Ng'ajore",
    enterRef: "Towap Namba kon a Reference ID:",
    enterOtp: "Towap OTP kon:",
    successClaim: "Eyokino. Ng'aropiyen iyokino nakony akaunti.",
    selectLang: "Ng'alakin Ng'ajore:\n1. Ng'ingereza\n2. Ng'iswahili\n3. Ng'iturkana",
    langUpdated: "Ng'ajore eyokino.",
    invalidOption: "Ng'option erono.",
    unregistered: "Namba kon meere egirito.",
    invalidRef: "Reference ID erono.",
    invalidOtp: "OTP erono.",
    accountBlocked: "Egolokino akaunti kon. Tojuma ng'akiro ka admin.",
    tryAgainLater: "Ikorite akidwang'a. Todar ng'isekondin {seconds} kinywang'a nabo.",
  },
};
