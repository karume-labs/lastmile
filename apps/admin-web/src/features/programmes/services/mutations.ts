import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface CreateBatchPayload {
  programmeName: string;
  targetCurrency: string;
  batchSize: number;
}

export const useCreateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBatchPayload) => {
      const response = await apiClient.post("/programmes/batches", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
};

export const useToggleProgrammeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      programmeId,
      status,
    }: {
      programmeId: string;
      status: "active" | "paused";
    }) => {
      const response = await apiClient.patch(
        `/programmes/${programmeId}/status`,
        { status },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
};
