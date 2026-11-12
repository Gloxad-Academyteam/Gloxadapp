"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiAlertTriangle, FiBookOpen, FiChevronLeft, FiChevronRight, FiCreditCard, FiLogIn, FiMessageCircle, FiSearch, FiSettings, FiShield, FiUser, FiVideo, FiActivity } from "react-icons/fi";
import { getActivity, type TActivityCategory, type TActivityItem } from "@services/admin/metrics";
import { ListSkeleton } from "@components/Skeleton";
import UserAvatar from "@components/Avatar";
import { card, Empty, ErrorBox, timeAgo } from "../shared";

const CATEGORIES: { value: "" | TActivityCategory; label: string }[] = [
  { value: "", label: "Everything" },
  { value: "auth", label: "Sign-ins" },
  { value: "course", label: "Courses" },
  { value: "learning", label: "Learning" },
  { value: "payment", label: "Payments" },
  { value: "live", label: "Live classes" },
  { value: "message", label: "Messages" },
  { value: "tutor", label: "Tutors" },
  { value: "admin", label: "Admin actions" },
  { value: "institution", label: "Institutions" },
  { value: "other", label: "Other" },
];

const ICONS: Record<TActivityCategory, { icon: React.ElementType; tint: string }> = {
  auth: { icon: FiLogIn, tint: "bg-[#e9eaff] text-[#4a4cd6]" },
  course: { icon: FiBookOpen, tint: "bg-[#fff1df] text-[#b8650b]" },
  learning: { icon: FiUser, tint: "bg-[#e1f1ff] text-[#1f6fc4]" },
  payment: { icon: FiCreditCard, tint: "bg-[#e3f6ec] text-[#13804d]" },
  live: { icon: FiVideo, tint: "bg-[#fde8e8] text-[#d93a3a]" },
  message: { icon: FiMessageCircle, tint: "bg-[#efe9ff] text-[#6a3fd0]" },
  tutor: { icon: FiUser, tint: "bg-[#e9eaff] text-[#3f41c4]" },
  admin: { icon: FiShield, tint: "bg-[#fff4dc] text-[#a86a00]" },
  institution: { icon: FiSettings, tint: "bg-[#e1f1ff] text-[#1f6fc4]" },
  other: { icon: FiActivity, tint: "bg-[#eef0f6] text-[#6b7087]" },
};

const roleName = (role: string) => (role === "instructor" ? "Tutor" : role ? role.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "Visitor");

const Row = ({ item }: { item: TActivityItem }) => {
  const [open, setOpen] = useState(false);
  const style = ICONS[item.category] ?? ICONS.other;
  const Icon = item.ok ? style.icon : FiAlertTriangle;
  const who = item.actor.name || item.actor.email || "Someone not signed in";
  return (
    <li className="border-b border-[#f0f1f7] last:border-none">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition hover:bg-[#fafbfe]">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.ok ? style.tint : "bg-[#fdeaea] text-[#c43232]"}`}><Icon size={16} /></span>
        <UserAvatar className="hidden h-8 w-8 sm:inline-flex" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-[#12142b]">{item.label}</span>
          <span className="block truncate text-[12.5px] text-[#8a90a8]">{who} · {roleName(item.actor.role)}</span>
        </span>
        <span className={`hidden rounded-full px-2.5 py-1 text-[11.5px] font-semibold sm:inline ${item.ok ? "bg-[#e3f6ec] text-[#13804d]" : "bg-[#fdeaea] text-[#b42323]"}`}>{item.ok ? "Done" : `Failed ${item.status}`}</span>
        <span className="w-[74px] shrink-0 text-right text-[12px] text-[#8a90a8]">{timeAgo(item.at)}</span>
      </button>
      {open && (
        <dl className="grid gap-x-8 gap-y-2 bg-[#fafbfe] px-5 pb-4 pl-[72px] pt-1 text-[12.5px] sm:grid-cols-2">
          <div><dt className="text-[#8a90a8]">When</dt><dd className="font-medium text-[#2b2f4a]">{new Date(item.at).toLocaleString()}</dd></div>
          <div><dt className="text-[#8a90a8]">Who</dt><dd className="font-medium text-[#2b2f4a]">{item.actor.name || "Not signed in"}{item.actor.email ? ` (${item.actor.email})` : ""}</dd></div>
          <div><dt className="text-[#8a90a8]">Request</dt><dd className="break-all font-mono text-[12px] text-[#2b2f4a]">{item.method} {item.path} → {item.status}</dd></div>
          <div><dt className="text-[#8a90a8]">Took</dt><dd className="font-medium text-[#2b2f4a]">{item.durationMs} ms</dd></div>
          <div><dt className="text-[#8a90a8]">Address</dt><dd className="font-medium text-[#2b2f4a]">{item.ip || "Unknown"}</dd></div>
          <div><dt className="text-[#8a90a8]">Device</dt><dd className="truncate font-medium text-[#2b2f4a]" title={item.userAgent}>{item.userAgent || "Unknown"}</dd></div>
        </dl>
      )}
    </li>
  );
};

const AdminActivityPage = () => {
  const [category, setCategory] = useState<"" | TActivityCategory>("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState<"" | "true" | "false">("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [live, setLive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => setPage(1), [category, role, result, debounced]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin.activity", category, role, result, debounced, page],
    queryFn: () => getActivity({ category, role, ok: result, search: debounced, page, limit: 25 }),
    placeholderData: (previous) => previous,
    // New events appear by themselves while you are on the first page
    refetchInterval: live && page === 1 ? 5000 : false,
    staleTime: 0,
  });

  const select = "h-10 rounded-lg border border-[#dfe2ee] bg-white px-3 text-[13.5px] text-[#2b2f4a] outline-none focus:border-[#5d5fef]";

  return (
    <div className="mx-auto w-full max-w-[1100px] pb-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-semibold tracking-tight text-[#12142b]">Activity</h2>
          <p className="text-[14px] text-[#6b7087]">Every sign-in, change and failure on the platform, as it happens.</p>
        </div>
        <button type="button" onClick={() => setLive((value) => !value)} aria-pressed={live} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-[13.5px] font-semibold transition ${live ? "border-[#bfe8d0] bg-[#e9f8f0] text-[#13804d]" : "border-[#dfe2ee] bg-white text-[#6b7087]"}`}>
          <span className="relative flex h-2 w-2"><span className={`absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60 ${live ? "animate-ping" : "hidden"}`} /><span className={`relative inline-flex h-2 w-2 rounded-full ${live ? "bg-[#22c55e]" : "bg-[#b3b8cf]"}`} /></span>
          {live ? "Live" : "Paused"}
        </button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className={`${card} p-5`}><p className="text-[13px] text-[#6b7087]">Events in the last 24 hours</p><p className="mt-2 text-[28px] font-semibold leading-none tracking-tight">{data?.summary.last24h ?? "-"}</p></div>
        <div className={`${card} p-5`}><p className="text-[13px] text-[#6b7087]">Failed in the last 24 hours</p><p className={`mt-2 text-[28px] font-semibold leading-none tracking-tight ${data && data.summary.failed24h > 0 ? "text-[#c43232]" : ""}`}>{data?.summary.failed24h ?? "-"}</p></div>
        <div className={`${card} p-5`}><p className="text-[13px] text-[#6b7087]">Matching your filters</p><p className="mt-2 text-[28px] font-semibold leading-none tracking-tight">{data?.total ?? "-"}</p></div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((item) => {
          const count = item.value ? data?.summary.byCategory[item.value] : undefined;
          return (
            <button key={item.label} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)} className={`h-9 rounded-full border px-3.5 text-[13px] font-medium transition ${category === item.value ? "border-[#12142b] bg-[#12142b] text-white" : "border-[#dfe2ee] bg-white text-[#4a4f6b] hover:bg-[#f6f7fb]"}`}>
              {item.label}{count ? <span className={`ml-1.5 text-[11.5px] ${category === item.value ? "text-white/70" : "text-[#9aa0b8]"}`}>{count}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa0b8]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a name, email, action or address" aria-label="Search activity" className="h-10 w-full rounded-lg border border-[#dfe2ee] bg-white pl-9 pr-3 text-[13.5px] outline-none placeholder:text-[#a2a8be] focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/10" />
        </div>
        <select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Filter by role" className={select}>
          <option value="">Everyone</option><option value="student">Students</option><option value="instructor">Tutors</option><option value="admin">Admins</option>
        </select>
        <select value={result} onChange={(event) => setResult(event.target.value as "" | "true" | "false")} aria-label="Filter by result" className={select}>
          <option value="">Any result</option><option value="true">Done</option><option value="false">Failed</option>
        </select>
      </div>

      {isLoading ? (
        <ListSkeleton rows={8} />
      ) : isError || !data ? (
        <ErrorBox onRetry={() => refetch()} />
      ) : (
        <section className={`${card} overflow-hidden ${isFetching ? "opacity-90" : ""}`}>
          {data.items.length === 0 ? (
            <Empty text="Nothing matches these filters yet." />
          ) : (
            <ul>{data.items.map((item) => <Row key={item.id} item={item} />)}</ul>
          )}
          <div className="flex items-center justify-between border-t border-[#eef0f6] px-5 py-3 text-[13px] text-[#6b7087]">
            <span>Page {data.page} of {data.totalPages}</span>
            <div className="flex gap-1">
              <button type="button" aria-label="Newer" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronLeft /></button>
              <button type="button" aria-label="Older" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronRight /></button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminActivityPage;
