import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type Participant = {
  id: string;
  fullName: string;
  phoneNumber: string;
  failedAttempts: number;
  lockoutUntil: Date | null;
  ussdBlocked: boolean;
  referenceId: string;
};

export const useParticipants = () => {
  return useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Participant[] }>("/registration");
      return response.data;
    },
  });
};
