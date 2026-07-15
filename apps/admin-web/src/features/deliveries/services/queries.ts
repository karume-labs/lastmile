import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useDeliveries = () => {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: async () => {
      const response = await apiClient.get("/deliveries");
      return response.data;
    },
  });
};
