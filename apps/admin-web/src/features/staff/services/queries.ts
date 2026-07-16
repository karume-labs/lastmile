import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user" | null;
  banned: boolean | null;
  createdAt: Date | null;
};

export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: StaffMember[] }>("/staff");
      return response.data;
    },
  });
};
