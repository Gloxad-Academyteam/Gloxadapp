import { Suspense } from "react";
import SignUpPage from "@pages/Auth/SignUpPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpPage />
    </Suspense>
  );
}
