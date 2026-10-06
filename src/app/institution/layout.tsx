import type { Metadata } from "next";
import { institutionFontClass } from "@pages/Institution/fonts";
import { OnboardingProvider } from "@pages/Institution/context/OnboardingContext";

export const metadata: Metadata = {
  title: "Institutions | Gloxad Academy",
  description:
    "Empower your institution with enterprise-grade digital learning management. Manage departments, tutors, and students on Gloxad.",
};

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`inst-scope ${institutionFontClass} min-h-screen bg-white text-[#1b1d33]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <OnboardingProvider>{children}</OnboardingProvider>
    </div>
  );
}
