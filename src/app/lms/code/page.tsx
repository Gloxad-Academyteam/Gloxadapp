import { Suspense } from "react";
import CodingLabPage from "@pages/Lms/CodingLabPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CodingLabPage />
    </Suspense>
  );
}
