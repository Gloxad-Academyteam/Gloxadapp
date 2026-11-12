import { Suspense } from "react";
import SignInPage from "@pages/Auth/SignInPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInPage />
    </Suspense>
  );
}
