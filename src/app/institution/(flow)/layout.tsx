import TopBar from "@pages/Institution/components/TopBar";
import InstitutionFooter from "@pages/Institution/components/InstitutionFooter";

export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar showLogo />
      <div className="flex-1">{children}</div>
      <InstitutionFooter />
    </div>
  );
}
