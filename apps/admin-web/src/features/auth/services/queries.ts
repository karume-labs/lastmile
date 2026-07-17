import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useSession = () => {
  return useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/get-session");
      return response.data;
    },
    retry: false,
  });
};
