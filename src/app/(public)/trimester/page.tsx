import type { Metadata } from "next";
import TrimesterPage from "@pages/TrimesterPage";

export const metadata: Metadata = {
  title: "Trimester Courses | Gloxad Academy",
  description: "Enroll in structured trimester courses before the deadline and learn with a cohort of motivated students.",
  alternates: { canonical: "/trimester" },
};

export default function Page() {
  return <TrimesterPage />;
}
