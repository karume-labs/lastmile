import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useProxies = () => {
  return useQuery({
    queryKey: ["proxies"],
    queryFn: async () => {
      const response = await apiClient.get("/proxies");
      return response.data;
    },
  });
};
