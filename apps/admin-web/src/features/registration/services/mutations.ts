import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

export const useUnblockParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/registration/${id}/unblock`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Participant unblocked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to unblock participant");
    },
  });
};
