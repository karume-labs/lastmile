import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateLocalId, generateReferenceId } from "@/src/lib/id";
import type { RegistrationFormValues } from "@/src/features/registration/schema";

const QUEUE_KEY = "lastmile.registration-queue.v2";

export type SyncStatus = "pending" | "syncing" | "synced" | "failed";

export interface QueuedRegistration extends RegistrationFormValues {
  id: string;
  referenceId: string;
  queuedAt: string;
  syncStatus: SyncStatus;
  syncError: string | null;
  syncedAt: string | null;
  attempts: number;
}

const readQueue = async (): Promise<QueuedRegistration[]> => {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? (JSON.parse(raw) as QueuedRegistration[]) : [];
};

const writeQueue = async (queue: QueuedRegistration[]): Promise<void> => {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const getQueue = readQueue;

export const enqueueRegistration = async (values: RegistrationFormValues): Promise<QueuedRegistration> => {
  const queue = await readQueue();
  const record: QueuedRegistration = {
    ...values,
    id: generateLocalId(),
    referenceId: generateReferenceId(),
    queuedAt: new Date().toISOString(),
    syncStatus: "pending",
    syncError: null,
    syncedAt: null,
    attempts: 0,
  };
  await writeQueue([record, ...queue]);
  return record;
};

export const updateRecord = async (
  id: string,
  patch: Partial<Pick<QueuedRegistration, "syncStatus" | "syncError" | "syncedAt" | "attempts">>,
): Promise<QueuedRegistration[]> => {
  const queue = await readQueue();
  const next = queue.map((item) => (item.id === id ? { ...item, ...patch } : item));
  await writeQueue(next);
  return next;
};

export const removeRecord = async (id: string): Promise<QueuedRegistration[]> => {
  const queue = await readQueue();
  const next = queue.filter((item) => item.id !== id);
  await writeQueue(next);
  return next;
};

export const clearSyncedRecords = async (): Promise<QueuedRegistration[]> => {
  const queue = await readQueue();
  const next = queue.filter((item) => item.syncStatus !== "synced");
  await writeQueue(next);
  return next;
};

export interface QueueStats {
  total: number;
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
}

export const getQueueStats = (queue: QueuedRegistration[]): QueueStats => ({
  total: queue.length,
  pending: queue.filter((item) => item.syncStatus === "pending").length,
  syncing: queue.filter((item) => item.syncStatus === "syncing").length,
  synced: queue.filter((item) => item.syncStatus === "synced").length,
  failed: queue.filter((item) => item.syncStatus === "failed").length,
});
