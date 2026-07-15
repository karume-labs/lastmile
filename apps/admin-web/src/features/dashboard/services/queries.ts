import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/metrics");
      return response.data;
    },
  });
};
