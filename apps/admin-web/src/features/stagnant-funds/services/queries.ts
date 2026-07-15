import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useStagnantFunds = () => {
  return useQuery({
    queryKey: ["stagnant-funds"],
    queryFn: async () => {
      const response = await apiClient.get("/stagnant-funds");
      return response.data;
    },
  });
};
