import type { Metadata } from "next";
import { SmsContent } from "@/features/sms/components/SmsContent";

export const metadata: Metadata = {
  title: "SMS Messages | LastMile Admin",
  description: "Manage and track SMS communications.",
};

export default function SmsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <SmsContent />
    </div>
  );
}
