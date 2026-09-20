import { Suspense } from "react";
import PaymentSuccessPage from "@pages/PaymentSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
