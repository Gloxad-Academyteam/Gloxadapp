import { Suspense } from "react";
import VerifyOtpPage from "@pages/Auth/VerifyOtpPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpPage />
    </Suspense>
  );
}
