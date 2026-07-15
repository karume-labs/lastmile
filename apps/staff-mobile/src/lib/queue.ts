import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

const QUEUE_KEY = "lastmile.registration-queue";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Enter the participant's full name"),
  proxyPhone: z.string().min(9, "Enter a valid proxy phone number"),
  location: z.string().min(2, "Enter the registration location"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export interface QueuedRegistration extends RegistrationInput {
  referenceId: string;
  queuedAt: string;
}

const generateReferenceId = () => `LM-${Date.now().toString(36).toUpperCase()}`;

export const getQueue = async (): Promise<QueuedRegistration[]> => {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? (JSON.parse(raw) as QueuedRegistration[]) : [];
};

export const enqueueRegistration = async (input: RegistrationInput): Promise<QueuedRegistration> => {
  const queue = await getQueue();
  const record: QueuedRegistration = {
    ...input,
    referenceId: generateReferenceId(),
    queuedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([record, ...queue]));
  return record;
};

export const removeFromQueue = async (referenceId: string): Promise<QueuedRegistration[]> => {
  const queue = await getQueue();
  const next = queue.filter((item) => item.referenceId !== referenceId);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  return next;
};

export const clearQueue = async (): Promise<void> => {
  await AsyncStorage.removeItem(QUEUE_KEY);
};
