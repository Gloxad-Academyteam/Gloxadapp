import { Suspense } from "react";
import ApplicationsPage from "@pages/Admin/Partners/ApplicationsPage";

export default function Page() {
  // The page reads ?q=, ?status= and ?review= from the URL, which needs a Suspense boundary
  return (
    <Suspense fallback={null}>
      <ApplicationsPage />
    </Suspense>
  );
}
