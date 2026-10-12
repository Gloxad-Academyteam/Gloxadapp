import type { Metadata } from "next";
import RoleGuard from "@components/RoleGuard";

export const metadata: Metadata = {
  title: "Gloxad LMS | Trimester Program",
  robots: { index: false, follow: false },
};

// The trimester LMS is for signed-in users only. Signed-out visitors are sent to sign-in and come back here.
export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard returnAfterLogin>{children}</RoleGuard>;
}
