import type { Metadata } from "next";
import TrimesterPage from "@pages/TrimesterPage";

export const metadata: Metadata = {
  title: "Trimester Courses | Gloxad Academy",
  description: "Trimester courses are not available right now. Every Gloxad Academy course is free and self-paced.",
  alternates: { canonical: "/trimester" },
};

export default function Page() {
  return <TrimesterPage />;
}
