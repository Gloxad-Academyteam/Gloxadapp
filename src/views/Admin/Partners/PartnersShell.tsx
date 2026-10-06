"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { LuBell, LuFileText, LuGlobe, LuLayoutDashboard, LuMenu, LuSearch, LuSettings, LuX } from "react-icons/lu";
import { PiHandshake, PiIdentificationBadge } from "react-icons/pi";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import { partnerImages } from "./images";

const NAV: { label: string; Icon: IconType; href?: string }[] = [
  { label: "Dashboard", Icon: LuLayoutDashboard, href: "/admin/partners" },
  { label: "Institution Applications", Icon: LuFileText, href: "/admin/partners/applications" },
  { label: "Approved Partners", Icon: PiHandshake },
  { label: "Staff Management", Icon: PiIdentificationBadge },
  { label: "Settings", Icon: LuSettings },
];

const PartnersShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => setIsMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setIsMenuOpen(false);
    router.push(`/admin/partners/applications${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  const searchForm = (className: string) => (
    <form role="search" onSubmit={handleSearch} className={className}>
      <input
        type="search"
        aria-label="Search institutions"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search institutions..."
        className="w-full rounded-full border border-[#dfe2ee] bg-white py-3 pl-6 pr-14 text-[15px] text-[#1b1d33] placeholder:text-[#9a9db3] outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/15"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b57d0] text-white hover:bg-[#0a49ad]"
      >
        <LuSearch size={18} />
      </button>
    </form>
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <p className="text-[17px] font-medium leading-tight text-[#030069]">Gloxad Academy</p>
        <p className="mt-1 text-[17px] leading-tight text-[#1b1d33]">Admin Portal</p>
      </div>
      <nav aria-label="Admin portal" className="flex flex-col">
        {NAV.map(({ label, Icon, href }) => {
          const isActive = href === pathname;
          const className = `flex w-full items-center gap-4 border-l-[3px] px-6 py-3.5 text-left text-[17px] transition-colors ${
            isActive
              ? "border-[#030069] bg-[#e8e8e8] font-bold text-[#030069]"
              : "border-transparent text-[#2a2c42] hover:bg-[#e9f1fb]"
          }`;
          return href ? (
            <Link key={label} href={href} aria-current={isActive ? "page" : undefined} className={className}>
              <Icon size={24} className="shrink-0" /> {label}
            </Link>
          ) : (
            <button key={label} type="button" onClick={() => toast.info(`${label} is coming soon.`)} className={className}>
              <Icon size={24} className="shrink-0" /> {label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-3 border-t border-[#1f2380] px-6 py-5">
        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-[8px] bg-[#1b1d33]">
          <CategoryImage src={partnerImages.reviewer} className="h-full w-full object-cover" fallback={null} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[17px] font-medium leading-tight text-[#14162b]">Admin Reviewer</p>
          <p className="text-[13px] text-[#4a4d66]">Global Access</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between gap-3 border-b border-[#e3e6f3] bg-white px-4 sm:h-[74px] sm:px-8 lg:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-7">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#14162b] hover:bg-[#f2f3ff] lg:hidden"
          >
            <LuMenu size={24} />
          </button>
          <Link href="/admin/partners" aria-label="Gloxad admin home" className="shrink-0">
            <img src="/gloxadlogo.png" alt="Gloxad" className="h-[34px] w-auto object-contain sm:h-[44px]" />
          </Link>
          {searchForm("relative hidden max-w-[480px] flex-1 md:block")}
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" aria-label="Language" onClick={() => toast.info("Language settings are coming soon.")} className="flex h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#f2f3ff]">
            <LuGlobe size={26} strokeWidth={1.5} />
          </button>
          <button type="button" aria-label="Notifications" onClick={() => toast.info("Notifications are coming soon.")} className="flex h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#f2f3ff]">
            <LuBell size={26} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-[74px] hidden h-[calc(100vh-74px)] w-[270px] shrink-0 overflow-y-auto bg-[#f5faff] lg:block xl:w-[297px]">
          {sidebar}
        </aside>

        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <button type="button" aria-label="Close navigation" onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-[#0b0a2a]/50" />
            <div className="relative flex h-full w-[300px] max-w-[88vw] flex-col overflow-y-auto bg-[#f5faff] shadow-xl">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsMenuOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[#14162b] hover:bg-white"
              >
                <LuX size={20} />
              </button>
              {searchForm("relative mx-4 mt-14 md:hidden")}
              <div className="flex-1">{sidebar}</div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 pb-16 pt-8 sm:px-8 lg:px-10 xl:px-12">{children}</main>
      </div>
    </div>
  );
};

export default PartnersShell;
