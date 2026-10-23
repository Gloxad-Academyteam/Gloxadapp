import type { Metadata } from "next";
import TrimesterPage from "@pages/TrimesterPage";

export const metadata: Metadata = {
  title: "Trimester Courses | Gloxad Academy",
  description: "Learn in structured 3-month trimesters with live classes and a cohort, from Certificate to Diploma with an industry internship.",
  alternates: { canonical: "/trimester" },
};

export default function Page() {
  return <TrimesterPage />;
}
