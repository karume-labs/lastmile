import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useAudits = () => {
  return useQuery({
    queryKey: ["audits"],
    queryFn: async () => {
      const response = await apiClient.get("/audits");
      return response.data;
    },
  });
};
