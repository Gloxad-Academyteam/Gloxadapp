import type { Metadata } from "next";
import FreeCoursesPage from "@pages/FreeCoursesPage";

export const metadata: Metadata = {
  title: "Free Courses | Gloxad Academy",
  description: "Explore our free courses and upgrade anytime to get a certificate!",
  alternates: { canonical: "/free" },
};

export default function Page() {
  return <FreeCoursesPage />;
}
