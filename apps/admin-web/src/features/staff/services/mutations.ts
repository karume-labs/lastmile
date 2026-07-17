import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface ToggleBanPayload {
  id: string;
  banned: boolean;
}

interface UpdateStaffPayload {
  id: string;
  name?: string;
  role?: "admin" | "staff";
}

export const useToggleBan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, banned }: ToggleBanPayload) => {
      const response = await apiClient.patch(`/staff/${id}/ban`, { banned });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success(variables.banned ? "User has been banned" : "User has been unbanned");
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error?.response?.data?.error || "Failed to update ban status");
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateStaffPayload) => {
      const response = await apiClient.patch(`/staff/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member updated successfully");
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error?.response?.data?.error || "Failed to update staff member");
    },
  });
};
