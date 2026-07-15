import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { syncPendingRegistrations } from "@/src/features/registration/sync";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";

/**
 * Fires a sync attempt the moment the device transitions from offline to
 * online (and once on initial mount if already online), so field staff never
 * have to remember to manually sync.
 */
export const useAutoSync = () => {
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();
  const wasOnline = useRef<boolean | null>(null);

  useEffect(() => {
    const cameOnline = wasOnline.current !== true && isOnline;
    wasOnline.current = isOnline;

    if (!cameOnline) return;

    syncPendingRegistrations().finally(() => {
      queryClient.invalidateQueries({ queryKey: ["registration-queue"] });
    });
  }, [isOnline, queryClient]);
};
