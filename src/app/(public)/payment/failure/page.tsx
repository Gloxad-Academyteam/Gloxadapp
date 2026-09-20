import { Suspense } from "react";
import PaymentFailurePage from "@pages/PaymentFailurePage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentFailurePage />
    </Suspense>
  );
}
