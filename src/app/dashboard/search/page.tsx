import { Suspense } from "react";
import SearchResultsPage from "@pages/SearchResultsPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchResultsPage />
    </Suspense>
  );
}
