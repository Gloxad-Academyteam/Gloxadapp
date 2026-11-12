"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuBell, LuCheck, LuCheckCheck, LuMailOpen, LuSettings2, LuTrash2 } from "react-icons/lu";
import useNotifications from "@hooks/useNotifications";
import { ListSkeleton } from "@components/Skeleton";
import { dialog } from "@components/Dialog";
import { CATEGORY_LABELS, categoryForType, getSoundEnabled, playChime, setSoundEnabled, styleForType, timeAgo, type TCategory } from "@components/Notifications/typeStyle";
import { getNotificationPreferences, updateNotificationPreferences, type TNotification } from "@services/notifications";

const dayLabel = (iso: string) => {
  const date = new Date(iso);
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((start(new Date()) - start(date)) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "This week";
  return "Earlier";
};

const ORDER = ["Today", "Yesterday", "This week", "Earlier"];

const Switch = ({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) => (
  <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#5d5fef]" : "bg-[#d3d6e6]"}`}>
    <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${checked ? "left-[23px]" : "left-[3px]"}`} />
  </button>
);

/** Small panel with the alert options: an email for each notification and a sound for new ones. */
const AlertSettings = () => {
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const prefs = useQuery({ queryKey: ["notifications", "preferences"], queryFn: getNotificationPreferences, enabled: open });
  const save = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: (data) => queryClient.setQueryData(["notifications", "preferences"], data),
  });

  useEffect(() => setSound(getSoundEnabled()), []);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event: MouseEvent) => ref.current && !ref.current.contains(event.target as Node) && setOpen(false);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Alert settings" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe2ee] bg-white text-[#52607A] transition hover:bg-[#f6f7fb]">
        <LuSettings2 size={17} />
      </button>
      {open && (
        <div role="dialog" aria-label="Alert settings" className="absolute right-0 top-12 z-30 w-[300px] max-w-[calc(100vw-32px)] rounded-2xl border border-[#e8eaf3] bg-white p-4 shadow-[0_24px_60px_-16px_rgba(18,20,43,0.3)]">
          <h2 className="mb-3 text-[14px] font-semibold text-[#12142b]">Alerts</h2>
          <div className="flex items-start justify-between gap-4 py-2.5">
            <div>
              <p className="text-[13.5px] font-medium text-[#12142b]">Email me too</p>
              <p className="text-[12px] leading-snug text-[#8a90a8]">Get each new notification in your inbox.</p>
            </div>
            <Switch checked={Boolean(prefs.data?.emailAlerts)} label="Email alerts" onChange={(value) => save.mutate({ emailAlerts: value })} />
          </div>
          <div className="flex items-start justify-between gap-4 border-t border-[#f0f1f7] py-2.5">
            <div>
              <p className="text-[13.5px] font-medium text-[#12142b]">Play a sound</p>
              <p className="text-[12px] leading-snug text-[#8a90a8]">A soft chime when a new one arrives while you are here.</p>
            </div>
            <Switch checked={sound} label="Notification sound" onChange={(value) => { setSound(value); setSoundEnabled(value); if (value) playChime(); }} />
          </div>
          {prefs.isError && <p className="mt-2 text-[12px] text-[#b42323]">Email alerts could not be loaded right now.</p>}
        </div>
      )}
    </div>
  );
};

/** The one notifications page, for students and tutors alike. */
const NotificationsPage = () => {
  const router = useRouter();
  const { items, unreadCount, isLoading, isError, refetch, markRead, markUnread, markAllRead, remove, isMarkingAll } = useNotifications();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [category, setCategory] = useState<"" | TCategory>("");

  const present = useMemo(() => (Object.keys(CATEGORY_LABELS) as TCategory[]).filter((key) => items.some((item) => categoryForType(item.type) === key)), [items]);
  const visible = items.filter((item) => (tab === "all" || !item.isRead) && (!category || categoryForType(item.type) === category));
  const groups = useMemo(() => {
    const map = new Map<string, TNotification[]>();
    for (const item of visible) {
      const label = dayLabel(item.createdAt);
      map.set(label, [...(map.get(label) ?? []), item]);
    }
    return ORDER.filter((label) => map.has(label)).map((label) => ({ label, items: map.get(label) as TNotification[] }));
  }, [visible]);

  const open = (item: TNotification) => {
    if (!item.isRead) markRead([item.id]);
    if (!item.link) return;
    if (item.link.startsWith("/")) router.push(item.link);
    else window.open(item.link, "_blank", "noopener,noreferrer");
  };

  const confirmRemove = async (item: TNotification) => {
    if (await dialog.confirm({ title: "Delete this notification?", message: "It will be removed from your list.", tone: "danger" })) remove(item.id);
  };

  const tabClass = (active: boolean) => `h-9 rounded-full px-4 text-[13.5px] font-medium transition ${active ? "bg-[#12142b] text-white" : "text-[#4a4f6b] hover:bg-[#eef0f6]"}`;

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#12142b]">Notifications</h1>
          <p className="mt-1 text-[14px] text-[#6b7087]">{unreadCount > 0 ? `${unreadCount} unread` : "You are all caught up"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={markAllRead} disabled={unreadCount === 0 || isMarkingAll} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dfe2ee] bg-white px-4 text-[13.5px] font-semibold text-[#3f41c4] transition hover:bg-[#f6f7fb] disabled:cursor-not-allowed disabled:opacity-40">
            <LuCheckCheck size={16} /> Mark all as read
          </button>
          <AlertSettings />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
      <div role="tablist" aria-label="Filter notifications" className="inline-flex gap-1 rounded-full border border-[#e8eaf3] bg-white p-1">
        <button type="button" role="tab" aria-selected={tab === "all"} onClick={() => setTab("all")} className={tabClass(tab === "all")}>All</button>
        <button type="button" role="tab" aria-selected={tab === "unread"} onClick={() => setTab("unread")} className={tabClass(tab === "unread")}>
          Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
        </button>
      </div>
      {present.length > 1 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
          {present.map((key) => (
            <button key={key} type="button" aria-pressed={category === key} onClick={() => setCategory(category === key ? "" : key)} className={`h-8 rounded-full border px-3 text-[12.5px] font-medium transition ${category === key ? "border-[#3f41c4] bg-[#eef0ff] text-[#3f41c4]" : "border-[#dfe2ee] bg-white text-[#4a4f6b] hover:bg-[#f6f7fb]"}`}>{CATEGORY_LABELS[key]}</button>
          ))}
        </div>
      )}
      </div>

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <div className="rounded-2xl border border-[#e8eaf3] bg-white p-10 text-center">
          <p className="text-[16px] font-semibold text-[#12142b]">We could not load your notifications</p>
          <p className="mt-1 text-[14px] text-[#6b7087]">Check your connection and try again.</p>
          <button type="button" onClick={() => refetch()} className="mt-5 h-10 rounded-lg bg-[#12142b] px-5 text-[14px] font-semibold text-white">Try again</button>
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl border border-[#e8eaf3] bg-white px-6 py-14 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4fb] text-[#8a90a8]"><LuBell size={24} /></span>
          <p className="text-[16px] font-semibold text-[#12142b]">{tab === "unread" ? "Nothing unread" : "No notifications yet"}</p>
          <p className="mx-auto mt-1 max-w-[320px] text-[14px] text-[#6b7087]">{tab === "unread" ? "You have read everything. Nice work." : "Updates about your courses, classes and account will show up here."}</p>
          {tab === "unread" && <button type="button" onClick={() => setTab("all")} className="mt-5 text-[13.5px] font-semibold text-[#3f41c4] hover:underline">See all notifications</button>}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.label} aria-label={group.label}>
              <h2 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8a90a8]">{group.label}</h2>
              <ul className="overflow-hidden rounded-2xl border border-[#e8eaf3] bg-white shadow-[0_1px_2px_rgba(18,20,43,0.04)]">
                {group.items.map((item) => {
                  const style = styleForType(item.type);
                  const Icon = style.icon;
                  return (
                    <li key={item.id} className={`group relative flex items-start gap-3.5 border-b border-[#f0f1f7] px-4 py-4 last:border-none sm:px-5 ${item.isRead ? "" : "bg-[#f8f8ff]"}`}>
                      {!item.isRead && <span aria-hidden className="absolute left-0 top-0 h-full w-[3px] bg-[#5d5fef]" />}
                      <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.tint}`}><Icon size={18} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <button type="button" onClick={() => open(item)} className="min-w-0 text-left">
                            <span className={`block text-[14.5px] ${item.isRead ? "font-medium text-[#3b3f58]" : "font-semibold text-[#12142b]"}`}>{item.title}</span>
                          </button>
                          <span className="shrink-0 pt-0.5 text-[12px] text-[#8a90a8]">{timeAgo(item.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-[#6b7087]">{item.message}</p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[12.5px]">
                          {item.link && (
                            item.link.startsWith("/") ? (
                              <Link href={item.link} onClick={() => !item.isRead && markRead([item.id])} className="rounded-lg bg-[#eef0ff] px-2.5 py-1 font-semibold text-[#3f41c4] hover:bg-[#e3e6ff]">View</Link>
                            ) : (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={() => !item.isRead && markRead([item.id])} className="rounded-lg bg-[#eef0ff] px-2.5 py-1 font-semibold text-[#3f41c4] hover:bg-[#e3e6ff]">View</a>
                            )
                          )}
                          {item.isRead ? (
                            <button type="button" onClick={() => markUnread([item.id])} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium text-[#6b7087] hover:bg-[#f0f1f7]"><LuMailOpen size={13} /> Mark as unread</button>
                          ) : (
                            <button type="button" onClick={() => markRead([item.id])} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium text-[#6b7087] hover:bg-[#f0f1f7]"><LuCheck size={13} /> Mark as read</button>
                          )}
                          <button type="button" onClick={() => confirmRemove(item)} aria-label="Delete notification" className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium text-[#b42323] opacity-100 hover:bg-[#fdeaea] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"><LuTrash2 size={13} /> Delete</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
