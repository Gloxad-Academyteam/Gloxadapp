import type { Metadata } from "next";
import FreeCoursesPage from "@pages/FreeCoursesPage";

export const metadata: Metadata = {
  title: "Free Courses | Gloxad Academy",
  description: "Explore free courses, learn at your own pace, complete assessments and earn a certificate at no charge.",
  alternates: { canonical: "/free" },
};

export default function Page() {
  return <FreeCoursesPage />;
}
