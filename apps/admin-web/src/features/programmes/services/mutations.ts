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
      status: "Active" | "Draft";
    }) => {
      const response = await apiClient.patch(`/programmes/${programmeId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
};

export const useDisburseProgramme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { programmeId: string }) => {
      const response = await apiClient.post("/programmes/disburse", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
};

export const useDeleteProgramme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programmeId: string) => {
      const response = await apiClient.delete(`/programmes/${programmeId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
};

export interface MockOnrampPayload {
  programmeId: string;
  amountKes: number;
  mpesaPhoneNumber: string;
}

export const useMockOnramp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MockOnrampPayload) => {
      const response = await apiClient.post("/onramp/mock", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programmes"] });
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
};
