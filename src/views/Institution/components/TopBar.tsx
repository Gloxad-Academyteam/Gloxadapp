import Link from "next/link";
import SocialIcons from "@components/Header/SocialIcons";

const pillClass = "rounded-full px-3 py-1.5 transition-colors sm:px-4";

// Audience switcher (Students / Tutors / Institution) and social links shared by every institution page
// `contained` lines the pills up with the 1200px content column used by the landing page
const TopBar = ({ showLogo = false, contained = false }: { showLogo?: boolean; contained?: boolean }) => (
  <div className="border-b border-[#e8eaf3] bg-white">
    <div
      className={`mx-auto flex h-[60px] w-full items-center justify-between gap-4 px-4 sm:px-8 ${
        contained ? "max-w-[1512px] sm:h-[52px] xl:px-[120px]" : "max-w-[1600px] sm:h-[68px] xl:px-14"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-6">
        {showLogo && (
          <Link href="/" aria-label="Gloxad home" className="shrink-0">
            <img src="/gloxadlogo.png" alt="Gloxad" className="h-[28px] w-auto object-contain sm:h-[36px]" />
          </Link>
        )}
        <nav aria-label="Audience" className="flex items-center gap-0.5 text-[14px] font-medium sm:gap-2 sm:text-[16px]">
          <Link href="/" className={`${pillClass} text-[#46477f] hover:bg-[#f2f3ff]`}>
            Students
          </Link>
          <Link href="/teach" className={`${pillClass} text-[#1b1d33] hover:bg-[#f2f3ff]`}>
            Tutors
          </Link>
          <Link href="/institution" aria-current="page" className={`${pillClass} bg-[#0B1F4D] text-white`}>
            Institution
          </Link>
        </nav>
      </div>

      <SocialIcons className="hidden sm:flex" />
    </div>
  </div>
);

export default TopBar;
