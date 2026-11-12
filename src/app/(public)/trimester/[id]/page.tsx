import type { Metadata } from "next";
import TrimesterProgramPage from "@pages/TrimesterProgramPage";

export const metadata: Metadata = {
  title: "Trimester Program | Gloxad Academy",
  description: "Weeks, live class schedule, instructors and how to enrol in this Gloxad Academy trimester program.",
  openGraph: { images: [{ url: "/images/trimester/photos/week-4.webp", width: 1536, height: 1024, alt: "Learners working together on a Gloxad Academy trimester course" }] },
  twitter: { card: "summary_large_image", images: ["/images/trimester/photos/week-4.webp"] },
};

export default function Page() {
  return <TrimesterProgramPage />;
}
