import { AuditsContent } from "@/features/audits/components/AuditsContent";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";

const AuditsPage = () => {
  return (
    <AdminPanelPageLayout
      title="Audit Log"
      description="Complete audit trail of all administrative actions and system events."
    >
      <AuditsContent />
    </AdminPanelPageLayout>
  );
};

export default AuditsPage;
