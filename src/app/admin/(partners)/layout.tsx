import type { Metadata } from "next";
import RoleGuard from "@components/RoleGuard";
import { ApplicationsProvider } from "@pages/Admin/Partners/ApplicationsContext";
import PartnersShell from "@pages/Admin/Partners/PartnersShell";
import { institutionFontClass } from "@pages/Institution/fonts";

export const metadata: Metadata = {
  title: "Partner Admin | Gloxad Academy",
  robots: { index: false, follow: false },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`inst-scope ${institutionFontClass} min-h-screen bg-white text-[#1b1d33]`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <RoleGuard allowedRoles={["admin"]}>
        <ApplicationsProvider>
          <PartnersShell>{children}</PartnersShell>
        </ApplicationsProvider>
      </RoleGuard>
    </div>
  );
}
