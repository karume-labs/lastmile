import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useProgrammes = () => {
  return useQuery({
    queryKey: ["programmes"],
    queryFn: async () => {
      const response = await apiClient.get("/programmes");
      return response.data;
    },
  });
};
