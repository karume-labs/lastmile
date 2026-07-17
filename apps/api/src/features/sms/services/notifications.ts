import crypto from "node:crypto";
import { db } from "@lastmile/db/client";
import { smsMessages } from "@lastmile/db/schemas/sms";
import AfricasTalking from "africastalking";
import { eq } from "drizzle-orm";

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

interface AfricasTalkingSMSService {
  send(options: {
    to: string[];
    message: string;
    from?: string;
  }): Promise<AfricasTalkingSMSResponse>;
}

interface AfricasTalkingClient {
  SMS: AfricasTalkingSMSService;
}

// --- Credentials ---
const username = (process.env.AT_USERNAME ?? "sandbox").trim();
const apiKey = (process.env.AT_API_KEY ?? "").trim();

if (!apiKey) {
  console.warn("AT_API_KEY is not set — SMS dispatch will fail.");
}

const africasTalking = AfricasTalking({
  apiKey,
  username,
}) as AfricasTalkingClient;

const sms = africasTalking.SMS;

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
    const response = await sms.send({ to: [phoneNumber], message: sanitizedMessage });
    console.log(` Dispatched alert to ${phoneNumber} successfully.`);
    console.log(` SDK Response: ${JSON.stringify(response)}\n`);
    return response;
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
