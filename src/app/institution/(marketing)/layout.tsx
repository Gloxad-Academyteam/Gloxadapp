import TopBar from "@pages/Institution/components/TopBar";
import MarketingNav from "@pages/Institution/components/MarketingNav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar contained />
      <MarketingNav />
      {children}
    </>
  );
}
