import { Suspense } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Header reads the URL search params, which requires a Suspense boundary in the App Router */}
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
