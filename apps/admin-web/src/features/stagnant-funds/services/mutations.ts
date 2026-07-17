import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useInitiateClawback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await apiClient.post(`/programmes/clawback/execute`, { paymentId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stagnant-funds"] });
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
};
