import { DashboardContent } from "@/features/dashboard/components/DashboardContent";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";

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
