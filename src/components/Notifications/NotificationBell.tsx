"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuBell, LuCheckCheck } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import useNotifications from "@hooks/useNotifications";
import { useSocket } from "@hooks/useSocket";
import { styleForType, timeAgo } from "./typeStyle";

type TProps = { className?: string };

/** The bell in the top bar. Shows how many are unread, the latest few, and a way to mark them read. */
const NotificationBell = ({ className = "" }: TProps) => {
  const router = useRouter();
  const { items, unreadCount, isLoading, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const socket = useSocket();

  // A new notification arrives by socket: refresh the list so it shows at once
  useEffect(() => {
    if (!socket) return undefined;
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
    socket.on("new_notification", refresh);
    return () => {
      socket.off("new_notification", refresh);
    };
  }, [socket, queryClient]);

  useEffect(() => {
    if (!open) return undefined;
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

  const latest = items.slice(0, 6);
  const badge = unreadCount > 9 ? "9+" : String(unreadCount);

  const openItem = (id: string, isRead: boolean, link: string | null) => {
    if (!isRead) markRead([id]);
    setOpen(false);
    if (link) {
      if (link.startsWith("/")) router.push(link);
      else window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e6f0] bg-white text-[#52607A] transition-colors hover:bg-[#f4f6fb] hover:text-[#0B1F4D]"
      >
        <LuBell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#e5484d] px-1 text-[10px] font-bold leading-none text-white">{badge}</span>
        )}
      </button>

      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-[#e8eaf3] bg-white shadow-[0_24px_60px_-16px_rgba(18,20,43,0.3)]">
          <div className="flex items-center justify-between border-b border-[#eef0f6] px-4 py-3.5">
            <h2 className="text-[15px] font-semibold text-[#12142b]">Notifications</h2>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] font-semibold text-[#3f41c4] hover:bg-[#f0f1fb]">
                <LuCheckCheck size={14} /> Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto" data-lenis-prevent>
            {isLoading ? (
              <div className="space-y-3 p-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-[54px] w-full rounded-xl" />)}</div>
            ) : latest.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4fb] text-[#8a90a8]"><LuBell size={20} /></span>
                <p className="text-[14px] font-medium text-[#12142b]">You are all caught up</p>
                <p className="mt-0.5 text-[13px] text-[#8a90a8]">New updates will show here.</p>
              </div>
            ) : (
              <ul>
                {latest.map((item) => {
                  const style = styleForType(item.type);
                  const Icon = style.icon;
                  return (
                    <li key={item.id}>
                      <button type="button" onClick={() => openItem(item.id, item.isRead, item.link)} className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#f8f9fd] ${item.isRead ? "" : "bg-[#f6f7ff]"}`}>
                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.tint}`}><Icon size={16} /></span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-[13.5px] ${item.isRead ? "font-medium text-[#3b3f58]" : "font-semibold text-[#12142b]"}`}>{item.title}</span>
                          <span className="line-clamp-2 text-[12.5px] leading-snug text-[#6b7087]">{item.message}</span>
                          <span className="mt-1 block text-[11.5px] text-[#9aa0b8]">{timeAgo(item.createdAt)}</span>
                        </span>
                        {!item.isRead && <span aria-label="Unread" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#5d5fef]" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="block border-t border-[#eef0f6] px-4 py-3 text-center text-[13px] font-semibold text-[#3f41c4] hover:bg-[#f8f9fd]">
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
