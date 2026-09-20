import type { Metadata } from "next";
import TutorLandingPage from "@pages/Tutor/LandingPage";

export const metadata: Metadata = {
  title: "Become a Tutor | Gloxad Academy",
  description:
    "Share your knowledge and earn on your terms. Join the Gloxad Academy network of industry leaders to create, publish, and profit from your online courses.",
  alternates: { canonical: "/teach" },
};

export default function Page() {
  return <TutorLandingPage />;
}
