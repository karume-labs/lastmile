import { env } from "@lastmile/api/env";
import axios from "axios";

import crypto from "node:crypto";

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

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID();
  const payloadString = JSON.stringify(payload);
  
  // Kotani's required signature formula: timestamp.nonce.body
  const signaturePayload = `${timestamp}.${nonce}.${payloadString}`;
  const signature = crypto
    .createHmac("sha256", env.KOTANI_API_SECRET)
    .update(signaturePayload)
    .digest("hex");

  try {
    const response = await axios.post("https://api.kotanipay.com/v3/withdraw", payload, {
      headers: {
        Authorization: `Bearer ${env.KOTANI_API_KEY}`,
        "Content-Type": "application/json",
        "x-timestamp": timestamp,
        "x-nonce": nonce,
        "x-signature": signature,
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
