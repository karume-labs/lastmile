import { ProgrammesContent } from "@/features/programmes/components/ProgrammesContent";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";

const ProgrammesPage = () => {
  return (
    <AdminPanelPageLayout
      title="Programmes"
      description="Manage disbursement programmes and create new batches."
    >
      <ProgrammesContent />
    </AdminPanelPageLayout>
  );
};

export default ProgrammesPage;
