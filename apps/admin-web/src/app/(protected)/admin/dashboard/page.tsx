import { DashboardContent } from "@/features/dashboard/components/DashboardContent";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";
import { DashboardOnboardingTour } from "@/features/tours/components/DashboardOnboardingTour";

const DashboardPage = () => {
  return (
    <AdminPanelPageLayout
      title="Dashboard"
      description="Overview of your platform metrics and recent activity."
    >
      <DashboardOnboardingTour />
      <DashboardContent />
    </AdminPanelPageLayout>
  );
};

export default DashboardPage;
