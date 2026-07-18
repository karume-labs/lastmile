import type { SmsMessage } from "@lastmile/types/sms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SmsTemplatesResponse {
  language: string;
  templates: {
    disbursement: string;
    sensitization: string;
  };
}

export const useSmsMessages = () => {
  return useQuery({
    queryKey: ["smsMessages"],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: SmsMessage[] }>("/api/sms", {
        withCredentials: true,
      });
      return response.data;
    },
  });
};

export const useSmsTemplates = (phoneNumber: string) => {
  return useQuery({
    queryKey: ["smsTemplates", phoneNumber],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: SmsTemplatesResponse }>(
        `/api/sms/templates/${encodeURIComponent(phoneNumber)}`,
        { withCredentials: true },
      );
      return response.data;
    },
    enabled: phoneNumber.length > 0,
  });
};
