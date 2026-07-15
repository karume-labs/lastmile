import { SidebarLayout } from "@/features/shared/components/SidebarLayout";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default AdminLayout;
