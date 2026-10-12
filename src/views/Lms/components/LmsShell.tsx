"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  MdAssignment,
  MdDashboard,
  MdForum,
  MdLogout,
  MdMenuBook,
  MdOutlineAccountCircle,
  MdOutlineAssignment,
  MdOutlineDashboard,
  MdOutlineForum,
  MdOutlineHelpOutline,
  MdOutlineMailOutline,
  MdOutlineMenuBook,
  MdOutlineNotificationsNone,
  MdOutlineSearch,
  MdOutlineSettings,
  MdOutlineVideoCall,
  MdSettings,
  MdVideoCall,
} from "react-icons/md";
import { LuMenu, LuPlus, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import useAuth from "@hooks/useAuth";
import { TOP_TABS, TTopTab } from "../data";
import { primaryButton } from "./ui";

export type TNavKey = "dashboard" | "curriculum" | "live" | "assignments" | "community" | "settings";

const NAV: { key: TNavKey; label: string; href: string; Icon: IconType; ActiveIcon: IconType }[] = [
  { key: "dashboard", label: "Dashboard", href: "/lms", Icon: MdOutlineDashboard, ActiveIcon: MdDashboard },
  { key: "curriculum", label: "Curriculum", href: "/lms/curriculum", Icon: MdOutlineMenuBook, ActiveIcon: MdMenuBook },
  { key: "live", label: "Live Class", href: "/lms/live", Icon: MdOutlineVideoCall, ActiveIcon: MdVideoCall },
  { key: "assignments", label: "Assignments", href: "/lms/assignments", Icon: MdOutlineAssignment, ActiveIcon: MdAssignment },
  { key: "community", label: "Community", href: "/lms/community", Icon: MdOutlineForum, ActiveIcon: MdForum },
  { key: "settings", label: "Settings", href: "/dashboard/settings", Icon: MdOutlineSettings, ActiveIcon: MdSettings },
];

const soon = (label: string) => toast.info(`${label} is coming soon.`);

type TProps = {
  active?: TNavKey;
  topTab?: TTopTab | null;
  // Placeholder for the top-bar search box; omit to hide the box
  search?: string;
  // Brand name shown inside the top bar (certificates screen)
  topBrand?: boolean;
  bellDot?: boolean;
  // Replaces the whole top bar (live class screen); receives the function that opens the mobile menu
  topBar?: (openMenu: () => void) => ReactNode;
  // Account chip under Logout (live class screen)
  showUser?: boolean;
  // Move "New Inquiry" above the nav (cohort overview screen)
  inquiryOnTop?: boolean;
  // Let the page fill the whole content area with no padding (live class screen)
  flush?: boolean;
  children: ReactNode;
};

const Avatar = ({ size = 40 }: { size?: number }) => {
  const { authenticatedUser: user } = useAuth();
  const src = user?.avatarUrl || user?.avatar;
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "U";
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d9d7ea] bg-[#e7e8fb] text-[13px] font-bold text-[#1a1a7a]"
      style={{ width: size, height: size }}
    >
      {initials}
      {src && (
        <span className="absolute inset-0">
          <CategoryImage src={src} className="h-full w-full object-cover" fallback={null} />
        </span>
      )}
    </span>
  );
};

const LmsShell = ({ active, topTab = null, search, topBrand, bellDot, topBar, showUser, inquiryOnTop, flush, children }: TProps) => {
  const { authenticatedUser: user, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const inquiry = (
    <button
      type="button"
      onClick={() => soon("Inquiries")}
      className={`${primaryButton} w-full !rounded-[8px] !py-3.5 shadow-[0_10px_20px_-10px_rgba(2,0,96,0.7)]`}
    >
      <LuPlus size={16} /> New Inquiry
    </button>
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-5 pt-5">
        <p className="text-[24px] font-bold leading-tight text-[#1a1a7a]">Gloxad LMS</p>
        <p className="mt-0.5 text-[13px] text-[#4a4d66]">Trimester Program</p>
      </div>
      {inquiryOnTop && <div className="px-4 pb-6">{inquiry}</div>}
      <nav aria-label="LMS" className="flex flex-col gap-1">
        {NAV.map(({ key, label, href, Icon, ActiveIcon }) => {
          const isActive = key === active;
          const Glyph = isActive ? ActiveIcon : Icon;
          return (
            <Link
              key={key}
              href={href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-4 border-r-4 px-5 py-3 text-[14px] transition-colors ${
                isActive
                  ? "border-[#020060] bg-[#eceefd] font-bold text-[#1a1a7a]"
                  : "border-transparent text-[#4a4d66] hover:bg-[#f0eff9]"
              }`}
            >
              <Glyph size={22} className="shrink-0" /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 pb-5">
        {!inquiryOnTop && inquiry}
        <div className={`${inquiryOnTop ? "" : "mt-5 border-t border-[#dedcec] pt-4"} flex flex-col`}>
          <Link href="/#faqs" className="flex items-center gap-3 px-1 py-2.5 text-[13px] text-[#4a4d66] hover:text-[#1a1a7a]">
            <MdOutlineHelpOutline size={20} /> Help Center
          </Link>
          <button type="button" onClick={() => handleLogout()} className="flex items-center gap-3 px-1 py-2.5 text-left text-[13px] text-[#4a4d66] hover:text-[#c62828]">
            <MdLogout size={20} /> Logout
          </button>
        </div>
        {showUser && (
          <div className="mt-3 flex items-center gap-3 px-1">
            <Avatar size={40} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-[#14162b]">{user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.name : "Student"}</p>
              <p className="text-[12px] text-[#4a4d66]">Cohort B</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    soon("Search");
  };

  return (
    <div className="flex min-h-screen bg-[#f9f8ff] text-[#1b1d33]" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 overflow-y-auto border-r border-[#dedcec] bg-[#f5f3fb] lg:block">{sidebar}</aside>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" aria-label="Close navigation" onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-[#0b0a2a]/50" />
          <div className="relative h-full w-[280px] max-w-[86vw] overflow-y-auto bg-[#f5f3fb] shadow-xl">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsMenuOpen(false)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[#14162b] hover:bg-white"
            >
              <LuX size={20} />
            </button>
            {sidebar}
            <div className="border-t border-[#dedcec] px-4 py-4">
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6a6d83]">Programme</p>
              {TOP_TABS.map((tab) =>
                tab.href ? (
                  <Link key={tab.key} href={tab.href} onClick={() => setIsMenuOpen(false)} className="block px-1 py-2 text-[14px] text-[#1b1d33] hover:text-[#1a1a7a]">
                    {tab.label}
                  </Link>
                ) : (
                  <button key={tab.key} type="button" onClick={() => soon(tab.label)} className="block px-1 py-2 text-left text-[14px] text-[#1b1d33] hover:text-[#1a1a7a]">
                    {tab.label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {topBar ? topBar(() => setIsMenuOpen(true)) : (
          <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-3 border-b border-[#dedcec] bg-[#f9f8ff]/95 px-4 backdrop-blur sm:px-8 xl:px-[56px]">
            <div className="flex min-w-0 items-center gap-3 sm:gap-8">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setIsMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#14162b] hover:bg-[#eceefd] lg:hidden"
              >
                <LuMenu size={24} />
              </button>
              {topBrand && <span className="hidden text-[22px] font-bold text-[#1a1a7a] sm:inline">Gloxad LMS</span>}
              <nav aria-label="Programme" className="hidden items-center gap-7 md:flex">
                {TOP_TABS.map((tab) => {
                  const isActive = tab.key === topTab;
                  const className = `relative flex h-[68px] items-center text-[14px] transition-colors ${
                    isActive ? "font-bold text-[#1a1a7a]" : "text-[#4a4d66] hover:text-[#1a1a7a]"
                  }`;
                  const underline = isActive && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1a1a7a]" />;
                  return tab.href ? (
                    <Link key={tab.key} href={tab.href} aria-current={isActive ? "page" : undefined} className={className}>
                      {tab.label}
                      {underline}
                    </Link>
                  ) : (
                    <button key={tab.key} type="button" onClick={() => soon(tab.label)} className={className}>
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {search && (
                <form role="search" onSubmit={handleSearch} className="relative hidden sm:block">
                  <input
                    type="search"
                    aria-label={search}
                    placeholder={search}
                    className="h-[40px] w-[230px] rounded-full border border-[#d6d4e6] bg-white pl-4 pr-10 text-[13px] text-[#1b1d33] placeholder:text-[#8d8fa6] outline-none focus:border-[#020060] lg:w-[280px]"
                  />
                  <MdOutlineSearch size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a4d66]" />
                </form>
              )}
              {topBrand && !search && (
                <button type="button" aria-label="Search" onClick={() => soon("Search")} className="flex h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#eceefd]">
                  <MdOutlineSearch size={24} />
                </button>
              )}
              <button type="button" aria-label="Notifications" onClick={() => soon("Notifications")} className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#eceefd]">
                <MdOutlineNotificationsNone size={24} />
                {bellDot && <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#e5322d]" />}
              </button>
              <button type="button" aria-label="Messages" onClick={() => soon("Messages")} className="flex h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#eceefd]">
                <MdOutlineMailOutline size={24} />
              </button>
              <Link href="/dashboard/settings" aria-label="Your account" className="shrink-0">
                {search || topBrand ? <Avatar size={40} /> : <MdOutlineAccountCircle size={28} className="text-[#14162b]" />}
              </Link>
            </div>
          </header>
        )}
        <main className={`min-w-0 flex-1 ${flush ? "" : "px-4 pb-16 pt-8 sm:px-8 xl:px-[64px]"}`}>{children}</main>
      </div>
    </div>
  );
};

export default LmsShell;
export { Avatar as LmsAvatar, soon };
