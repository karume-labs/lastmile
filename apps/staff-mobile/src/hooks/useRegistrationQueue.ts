import { useQuery } from "@tanstack/react-query";
import { getQueue, getQueueStats } from "@/src/features/registration/queue";

export const REGISTRATION_QUEUE_KEY = ["registration-queue"] as const;

export const useRegistrationQueue = () => {
  const query = useQuery({ queryKey: REGISTRATION_QUEUE_KEY, queryFn: getQueue });
  const queue = query.data ?? [];
  return { ...query, queue, stats: getQueueStats(queue) };
};
