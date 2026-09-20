import Footer from "@components/Footer";
import AuthGuard from "@components/AuthGuard";

// Auth pages intentionally have no top navigation — just the form card and the footer.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthGuard>{children}</AuthGuard>
      <Footer />
    </>
  );
}
