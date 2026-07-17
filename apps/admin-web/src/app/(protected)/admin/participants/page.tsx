import { Users } from "lucide-react";
import { ParticipantsContent } from "@/features/registration/components/ParticipantsContent";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";

export default function ParticipantsPage() {
  return (
    <AdminPanelPageLayout
      title="Participants"
      description="Manage participant USSD access and view blocked accounts."
      actions={
        <div className="flex items-center gap-2">
          <Users className="size-4" />
        </div>
      }
    >
      <ParticipantsContent />
    </AdminPanelPageLayout>
  );
}
