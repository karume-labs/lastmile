import type { SmsCreateRequest, SmsMessage } from "@lastmile/types/sms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateSms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SmsCreateRequest) => {
      const response = await axios.post<{ success: boolean; data: SmsMessage }>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sms`,
        data,
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smsMessages"] });
    },
  });
};
