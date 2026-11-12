import type { Metadata } from "next";
import TrimesterPage from "@pages/TrimesterPage";

export const metadata: Metadata = {
  title: "Trimester Program: guided courses with live classes | Gloxad Academy",
  description: "A guided, cohort-based programme with live classes every week, real tutors, hands-on work, a final project and a certificate you can verify. See the courses, dates and how to enrol.",
  alternates: { canonical: "/trimester" },
  openGraph: { images: [{ url: "/images/trimester/photos/week-4.webp", width: 1536, height: 1024, alt: "Learners working together on a Gloxad Academy trimester course" }] },
  twitter: { card: "summary_large_image", images: ["/images/trimester/photos/week-4.webp"] },
};

export default function Page() {
  return <TrimesterPage />;
}
