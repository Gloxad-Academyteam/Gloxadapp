"use client";

import NotificationBell from "@components/Notifications/NotificationBell";
import UserAvatar from "@components/Avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBars3,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineSignal,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineCloudArrowUp,
  HiOutlineCog8Tooth,
  HiOutlineCreditCard,
  HiOutlineMagnifyingGlass,
  HiOutlineSquares2X2,
  HiOutlineStar,
  HiOutlineUserGroup,
  HiOutlineXMark,
} from "react-icons/hi2";
import useAuth from "@hooks/useAuth";

type TNavItem = { label: string; to: string; icon: React.ElementType; exact?: boolean };
type TNavGroup = { title: string; items: TNavItem[] };

const NAV: TNavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/admin", icon: HiOutlineSquares2X2, exact: true },
      { label: "Analytics", to: "/admin/analytics", icon: HiOutlineChartBar },
      { label: "Live now", to: "/admin/live", icon: HiOutlineSignal },
      { label: "Activity", to: "/admin/activity", icon: HiOutlineClipboardDocumentList },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Students", to: "/admin/students", icon: HiOutlineUserGroup },
      { label: "Tutors", to: "/admin/tutors", icon: HiOutlineAcademicCap },
    ],
  },
  {
    title: "Learning",
    items: [
      { label: "Courses", to: "/admin/courses", icon: HiOutlineBookOpen },
      { label: "Upload courses", to: "/admin/upload", icon: HiOutlineCloudArrowUp },
      { label: "Reviews", to: "/admin/reviews", icon: HiOutlineStar },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Finance", to: "/admin/finance", icon: HiOutlineCreditCard },
      { label: "Messages", to: "/admin/messages", icon: HiOutlineChatBubbleOvalLeft },
      { label: "Settings", to: "/admin/settings", icon: HiOutlineCog8Tooth },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((group) => group.items);
const isActive = (pathname: string, item: TNavItem) => (item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`));

const NavLink = ({ item, active, collapsed, onNavigate }: { item: TNavItem; active: boolean; collapsed: boolean; onNavigate: () => void }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.to}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors ${
        active ? "bg-[#5d5fef]/15 text-white" : "text-[#9ba0c2] hover:bg-white/5 hover:text-white"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      {active && <span aria-hidden className="absolute left-0 top-2 h-6 w-[3px] rounded-r-full bg-[#7c7ef5]" />}
      <Icon className={`h-[20px] w-[20px] shrink-0 ${active ? "text-[#a5a7ff]" : ""}`} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { authenticatedUser, handleLogout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setMenuOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = ALL_ITEMS.find((item) => isActive(pathname, item));
  const matches = useMemo(() => (query.trim() ? ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())) : []), [query]);
  const name = authenticatedUser?.name || [authenticatedUser?.firstName, authenticatedUser?.lastName].filter(Boolean).join(" ") || "Administrator";
  const isMessages = pathname.includes("/messages");

  const sidebar = (isCollapsed: boolean, mobile = false) => (
    <div className="flex h-full flex-col bg-[#0e1022] text-white">
      <div className={`flex h-16 shrink-0 items-center border-b border-white/[0.06] ${isCollapsed ? "justify-center" : "justify-between px-5"}`}>
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <Image src="/gloxadlogo.png" alt="" width={22} height={22} className="h-[18px] w-auto object-contain" />
          </span>
          {!isCollapsed && <span className="text-[15.5px] font-semibold tracking-tight">Gloxad Admin</span>}
        </Link>
        {mobile && (
          <button type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ba0c2] hover:bg-white/5">
            <HiOutlineXMark size={20} />
          </button>
        )}
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-6 overflow-y-auto px-3 py-5" data-lenis-prevent>
        {NAV.map((group) => (
          <div key={group.title}>
            {!isCollapsed ? <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5d6290]">{group.title}</p> : <div className="mx-3 mb-2 border-t border-white/[0.06]" />}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.to} item={item} active={isActive(pathname, item)} collapsed={isCollapsed} onNavigate={() => setDrawerOpen(false)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/[0.06] p-3">
        <div className={`flex items-center gap-3 rounded-lg p-2 ${isCollapsed ? "justify-center" : ""}`}>
          <UserAvatar src={authenticatedUser?.avatar || authenticatedUser?.avatarUrl} className="h-9 w-9" placeholderClassName="bg-[#2a2d52] text-[#8d92c4]" />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium">{name}</p>
              <p className="truncate text-[12px] text-[#7c82aa]">{authenticatedUser?.email}</p>
            </div>
          )}
          {!isCollapsed && (
            <button type="button" aria-label="Sign out" title="Sign out" onClick={handleLogout} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9ba0c2] hover:bg-white/5 hover:text-white">
              <HiOutlineArrowRightOnRectangle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f7fb] text-[#12142b]">
      {/* Desktop sidebar */}
      <aside className={`hidden shrink-0 transition-[width] duration-200 md:block ${collapsed ? "w-[72px]" : "w-[256px]"}`}>{sidebar(collapsed)}</aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-[#0b0d1a]/60" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[272px] max-w-[85vw] shadow-2xl">{sidebar(false, true)}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[#e8eaf3] bg-white/90 px-4 backdrop-blur sm:px-6">
          <button type="button" aria-label="Open menu" onClick={() => setDrawerOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4a4f6b] hover:bg-[#f0f1f7] md:hidden">
            <HiOutlineBars3 size={22} />
          </button>
          <button type="button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed((value) => !value)} className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#4a4f6b] hover:bg-[#f0f1f7] md:flex">
            <HiOutlineChevronDoubleLeft size={18} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>

          <h1 className="hidden text-[16px] font-semibold tracking-tight sm:block">{current?.label ?? "Admin"}</h1>

          <div className="relative ml-auto w-full max-w-[320px]">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa0b8]" size={17} />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && matches[0]) router.push(matches[0].to);
              }}
              placeholder="Jump to a page"
              aria-label="Jump to an admin page"
              className="h-10 w-full rounded-lg border border-[#e8eaf3] bg-[#f6f7fb] pl-9 pr-12 text-[13.5px] outline-none transition placeholder:text-[#a2a8be] focus:border-[#5d5fef] focus:bg-white focus:ring-4 focus:ring-[#5d5fef]/10"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-[#e0e3ef] bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-[#8a90a8] sm:block">⌘K</kbd>
            {query.trim() && (
              <ul className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-xl border border-[#e8eaf3] bg-white py-1 shadow-xl">
                {matches.length === 0 ? (
                  <li className="px-3 py-2.5 text-[13px] text-[#8a90a8]">No matching page</li>
                ) : (
                  matches.map((item) => (
                    <li key={item.to}>
                      <Link href={item.to} className="flex items-center gap-2.5 px-3 py-2.5 text-[13.5px] hover:bg-[#f6f7fb]">
                        <item.icon size={17} className="text-[#6b7087]" /> {item.label}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#4a4f6b] hover:bg-[#f0f1f7] lg:inline-flex">
            View site <HiOutlineArrowTopRightOnSquare size={15} />
          </Link>

          <NotificationBell />

          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-transparent transition hover:ring-[#5d5fef]/30"
            >
              <UserAvatar src={authenticatedUser?.avatar || authenticatedUser?.avatarUrl} className="h-10 w-10" />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-12 z-30 w-[240px] overflow-hidden rounded-xl border border-[#e8eaf3] bg-white shadow-xl">
                <div className="border-b border-[#eef0f6] px-4 py-3">
                  <p className="truncate text-[13.5px] font-semibold">{name}</p>
                  <p className="truncate text-[12px] text-[#8a90a8]">{authenticatedUser?.email}</p>
                </div>
                <Link role="menuitem" href="/admin/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] hover:bg-[#f6f7fb]"><HiOutlineCog8Tooth size={17} /> Settings</Link>
                <Link role="menuitem" href="/" target="_blank" className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] hover:bg-[#f6f7fb]"><HiOutlineArrowTopRightOnSquare size={17} /> View site</Link>
                <button role="menuitem" type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 border-t border-[#eef0f6] px-4 py-2.5 text-left text-[13.5px] text-[#b42323] hover:bg-[#fdf3f3]">
                  <HiOutlineArrowRightOnRectangle size={17} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main data-lenis-prevent className={`relative w-full flex-1 overflow-y-auto ${isMessages ? "" : "px-4 py-6 sm:px-6 lg:px-8 lg:py-8"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
