import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useToggleProxyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      proxyId,
      status,
    }: {
      proxyId: string;
      status: "active" | "suspended";
    }) => {
      const response = await apiClient.patch(`/proxies/${proxyId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proxies"] });
    },
  });
};
