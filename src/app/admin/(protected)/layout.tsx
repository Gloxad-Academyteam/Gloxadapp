import RoleGuard from "@components/RoleGuard";
import AdminLayout from "@components/Layout/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]} loginPath="/admin/login">
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
