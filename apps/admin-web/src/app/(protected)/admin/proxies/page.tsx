import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProxiesContent } from "@/features/proxies/components/ProxiesContent";
import { AdminPanelPageLayout } from "@/features/shared/components/AdminPanelPageLayout";

const ProxiesPage = () => {
  return (
    <AdminPanelPageLayout
      title="Proxy Management"
      description="Manage authorized proxy agents who can receive OTPs on behalf of participants."
      actions={
        <Button size="sm">
          <Users className="mr-2 size-4" />
          Add Proxy
        </Button>
      }
    >
      <ProxiesContent />
    </AdminPanelPageLayout>
  );
};

export default ProxiesPage;
