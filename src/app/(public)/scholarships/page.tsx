import type { Metadata } from "next";
import ScholarshipsPage from "@pages/ScholarshipsPage";

export const metadata: Metadata = {
  title: "Scholarships | Gloxad Academy",
  description: "Open, upcoming and closed Gloxad Academy scholarships, with how to apply.",
  alternates: { canonical: "/scholarships" },
};

export default function Page() {
  return <ScholarshipsPage />;
}
