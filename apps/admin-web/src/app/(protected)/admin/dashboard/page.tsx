import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";
import { DashboardContent } from "@/features/dashboard/components/DashboardContent";

const DashboardPage = () => {
  return (
    <AdminPanelPageLayout
      title="Dashboard"
      description="Overview of your platform metrics and recent activity."
    >
      <DashboardContent />
    </AdminPanelPageLayout>
  );
};

export default DashboardPage;
