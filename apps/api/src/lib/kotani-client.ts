import { env } from "@lastmile/api/env";
import axios from "axios";

export const triggerOfframpToMpesa = async (
  phoneNumber: string,
  amountUsdc: number,
  referenceId: string,
) => {
  const payload = {
    customerPhoneNumber: phoneNumber,
    amount: amountUsdc,
    cryptoCurrency: "USDC",
    fiatCurrency: "KES",
    network: "STELLAR",
    reference: referenceId,
  };

  try {
    const response = await axios.post("https://api.kotanipay.com/v3/withdraw", payload, {
      headers: {
        Authorization: `Bearer ${env.KOTANI_API_KEY}`,
      },
    });

    return {
      success: true,
      kotaniTransactionId: response.data.kotaniTransactionId || `kp_txn_${Date.now()}`,
    };
  } catch (error) {
    console.error("Kotani Pay offramp failed:", error);
    return {
      success: false,
      error: "Kotani Pay offramp failed",
    };
  }
};
