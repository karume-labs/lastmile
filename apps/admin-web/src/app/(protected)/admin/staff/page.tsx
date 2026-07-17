import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";
import { StaffContent } from "@/features/staff/components/StaffContent";

export default function StaffPage() {
  return (
    <AdminPanelPageLayout
      title="Staff"
      description="Manage your internal team members and their access roles."
      actions={
        <Button size="sm">
          <Users className="mr-2 size-4" />
          Add Staff
        </Button>
      }
    >
      <StaffContent />
    </AdminPanelPageLayout>
  );
}
