import type { Metadata } from "next";
import TrimesterPage from "@pages/TrimesterPage";

export const metadata: Metadata = {
  title: "Trimester Program | Gloxad Academy",
  description: "A four week guided program with live classes, assignments, a final project and a certificate.",
  alternates: { canonical: "/trimester" },
};

export default function Page() {
  return <TrimesterPage />;
}
