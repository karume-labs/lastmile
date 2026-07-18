import crypto from "node:crypto";
import { db } from "@lastmile/db/client";
import { smsMessages } from "@lastmile/db/schemas/sms";
import axios from "axios";
import { eq } from "drizzle-orm";
import { env } from "../../../env";

interface AfricasTalkingSMSResponse {
  SMSMessageData: {
    Message: string;
    Recipients: Array<{
      statusCode: number;
      number: string;
      status: string;
      cost: string;
      messageId: string;
    }>;
  };
}

// --- Core dispatch primitive ---

/**
 * Sends a raw SMS to a single phone number.
 */
export async function dispatchAlert(
  phoneNumber: string,
  message: string,
): Promise<AfricasTalkingSMSResponse | null> {
  try {
    const sanitizedMessage = message.trim().replace(/\s+/g, " ");

    // console.log("AT_API_KEY", env.AT_API_KEY);
    // console.log("AT_USERNAME", env.AT_USERNAME);

    const payload = new URLSearchParams({
      username: env.AT_USERNAME,
      to: phoneNumber,
      message: sanitizedMessage,
    });

    const response = await axios.post<AfricasTalkingSMSResponse>(
      "https://api.sandbox.africastalking.com/version1/messaging",
      payload,
      {
        headers: {
          apiKey: env.AT_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    console.log(` Dispatched alert to ${phoneNumber} successfully.`);
    console.log(` API Response: ${JSON.stringify(response.data)}\n`);
    return response.data;
  } catch (err) {
    console.error(`Failed to dispatch to ${phoneNumber}:`, err);
    return null;
  }
}

/**
 * Sends a raw SMS to a single phone number and tracks it in the database.
 */
export async function dispatchAndTrackAlert(
  phoneNumber: string,
  message: string,
): Promise<AfricasTalkingSMSResponse | null> {
  const messageId = crypto.randomUUID();

  // Create pending record
  await db.insert(smsMessages).values({
    id: messageId,
    recipient: phoneNumber,
    content: message,
    status: "pending",
  });

  const response = await dispatchAlert(phoneNumber, message);

  // Update status based on response
  await db
    .update(smsMessages)
    .set({ status: response ? "sent" : "failed" })
    .where(eq(smsMessages.id, messageId));

  return response;
}
