import { Suspense } from "react";
import ResetPasswdPage from "@pages/Auth/ResetPasswdPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswdPage />
    </Suspense>
  );
}
