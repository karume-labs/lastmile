import type { SmsMessage } from "@lastmile/types/sms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useSmsMessages = () => {
  return useQuery({
    queryKey: ["smsMessages"],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: SmsMessage[] }>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sms`,
        { withCredentials: true },
      );
      return response.data;
    },
  });
};
