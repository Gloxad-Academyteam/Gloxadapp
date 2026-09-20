import DashboardGuard from "@components/DashboardGuard";
import DashboardLayout from "@components/Layout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardGuard>
  );
}
