"use client";

import Avatar from "@components/Avatar";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiGrid, FiLock, FiUser } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";

type TProps = {
  authenticatedUser: any;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

// The signed-in person's avatar and menu: who they are, where to go, and log out
const ProfileMenu = ({ authenticatedUser, onLogout, isLoggingOut = false }: TProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on a click outside or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = [authenticatedUser?.firstName, authenticatedUser?.lastName].filter(Boolean).join(" ") || authenticatedUser?.name || "Your account";
  const role = authenticatedUser?.role === "instructor" ? "Tutor" : authenticatedUser?.role === "admin" ? "Admin" : "Student";
  const dashboard = authenticatedUser?.role === "admin" ? "/admin" : "/dashboard";

  const avatar = (size: string, _text: string) => <Avatar src={authenticatedUser?.avatar} className={size} placeholderClassName="bg-[#e6e9f5] text-[#98a0c0]" />;

  const item = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#2b2f45] transition-colors hover:bg-[#f1f3f9] hover:text-[#0B1F4D]";
  const icon = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f3f9] text-[#52607A]";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-[42px] items-center gap-1.5 rounded-full border border-[#e3e6f0] bg-white py-1 pl-1 pr-2.5 transition-colors hover:bg-[#f4f6fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4D]/30"
      >
        {avatar("h-8 w-8", "text-[12px]")}
        <FiChevronDown aria-hidden className={`text-[15px] text-[#6b7389] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-[70] w-[280px] overflow-hidden rounded-2xl border border-[#e3e6f0] bg-white shadow-[0_18px_44px_rgba(11,31,77,0.16)]">
          <div className="flex items-center gap-3 border-b border-[#eef1f8] bg-[#f8f9fd] px-4 py-4">
            {avatar("h-11 w-11", "text-[15px]")}
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-[#201633]">{name}</p>
              {authenticatedUser?.email && <p className="truncate text-[12px] text-[#6b7389]">{authenticatedUser.email}</p>}
              <span className="mt-1 inline-block rounded-full bg-[#e8f0ff] px-2 py-0.5 text-[10.5px] font-semibold text-[#1d4ed8]">{role}</span>
            </div>
          </div>

          <div className="p-2">
            <Link href={dashboard} role="menuitem" onClick={() => setOpen(false)} className={item}>
              <span className={icon}><FiGrid size={16} aria-hidden /></span>
              {authenticatedUser?.role === "admin" ? "Admin dashboard" : "Dashboard"}
            </Link>
            <Link href="/dashboard?tab=settings" role="menuitem" onClick={() => setOpen(false)} className={item}>
              <span className={icon}><FiUser size={16} aria-hidden /></span>
              Basic information
            </Link>
            <Link href="/dashboard?tab=settings&section=password" role="menuitem" onClick={() => setOpen(false)} className={item}>
              <span className={icon}><FiLock size={16} aria-hidden /></span>
              Change password
            </Link>
          </div>

          <div className="border-t border-[#eef1f8] p-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => onLogout()}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold text-[#b93832] transition-colors hover:bg-[#fff3f2] disabled:cursor-wait disabled:opacity-60"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ffe9e7]"><LuLogOut size={16} aria-hidden /></span>
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
