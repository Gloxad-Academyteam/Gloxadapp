import { Suspense } from "react";
import DashboardPage from "@pages/DashboardPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardPage />
    </Suspense>
  );
}
