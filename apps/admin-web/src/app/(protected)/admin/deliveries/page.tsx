import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";
import { DeliveriesContent } from "@/features/deliveries/components/DeliveriesContent";

const DeliveriesPage = () => {
  return (
    <AdminPanelPageLayout
      title="Deliveries"
      description="Track and manage all disbursement deliveries across programmes."
    >
      <DeliveriesContent />
    </AdminPanelPageLayout>
  );
};

export default DeliveriesPage;
