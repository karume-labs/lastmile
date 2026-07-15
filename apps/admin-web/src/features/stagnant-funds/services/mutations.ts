import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useInitiateClawback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fundId: string) => {
      const response = await apiClient.post(`/clawback/initiate`, { fundId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stagnant-funds"] });
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
};
