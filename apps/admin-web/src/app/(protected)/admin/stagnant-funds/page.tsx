import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";
import { StagnantFundsContent } from "@/features/stagnant-funds/components/StagnantFundsContent";

const StagnantFundsPage = () => {
  return (
    <AdminPanelPageLayout
      title="Stagnant Funds"
      description="Review and manage funds that have not been accessed within the configured threshold."
    >
      <StagnantFundsContent />
    </AdminPanelPageLayout>
  );
};

export default StagnantFundsPage;
