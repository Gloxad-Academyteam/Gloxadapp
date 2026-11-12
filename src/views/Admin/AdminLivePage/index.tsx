"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { FiActivity, FiAward, FiClock, FiCreditCard, FiDatabase, FiUserPlus, FiUsers, FiVideo } from "react-icons/fi";
import { getLiveMetrics, type TLiveMetrics } from "@services/admin/metrics";
import { Skeleton } from "../../../components/Skeleton";
import { card, duration, Empty, ErrorBox, naira, Panel, timeAgo, tooltipStyle } from "../shared";

const REFRESH_MS = 5000;

const feedStyle: Record<TLiveMetrics["recent"][number]["type"], { icon: React.ElementType; tint: string }> = {
  signup: { icon: FiUserPlus, tint: "bg-[#e9eaff] text-[#4a4cd6]" },
  enrolment: { icon: FiUsers, tint: "bg-[#e1f1ff] text-[#1f6fc4]" },
  payment: { icon: FiCreditCard, tint: "bg-[#e3f6ec] text-[#13804d]" },
  scholarship: { icon: FiAward, tint: "bg-[#fff1df] text-[#b8650b]" },
  certificate: { icon: FiAward, tint: "bg-[#efe9ff] text-[#6a3fd0]" },
};

const startTime = (iso: string) => new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

const AdminLivePage = () => {
  const { data, isLoading, isError, refetch, dataUpdatedAt, isFetching } = useQuery({
    queryKey: ["admin.live"],
    queryFn: getLiveMetrics,
    refetchInterval: REFRESH_MS,
    staleTime: 0,
  });

  const header = (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2.5 text-[24px] font-semibold tracking-tight text-[#12142b]">
          Live now
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className={`absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60 ${isError ? "" : "animate-ping"}`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isError ? "bg-[#d93a3a]" : "bg-[#22c55e]"}`} />
          </span>
        </h2>
        <p className="text-[14px] text-[#6b7087]">Updates every few seconds while this page is open.</p>
      </div>
      {dataUpdatedAt > 0 && <p className="text-[12.5px] text-[#8a90a8]">{isFetching ? "Refreshing..." : `Updated ${new Date(dataUpdatedAt).toLocaleTimeString()}`}</p>}
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        {header}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[130px] rounded-2xl" />)}</div>
        <Skeleton className="mt-6 h-[320px] rounded-2xl" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        {header}
        <ErrorBox onRetry={() => refetch()} />
      </div>
    );
  }

  const { online, liveClasses, upcomingClasses, today, queue, recent, system, traffic } = data;
  const inClass = liveClasses.reduce((sum, session) => sum + session.participants, 0);
  const queueItems = [
    { count: queue.pendingTutors, text: "Tutor applications", href: "/admin/tutors" },
    { count: queue.pendingCourses, text: "Courses awaiting approval", href: "/admin/courses" },
    { count: queue.scholarshipApplications, text: "Scholarship applications", href: "/admin/notifications" },
    { count: queue.appeals, text: "Open appeals", href: "/admin/courses/appeal" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10">
      {header}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`${card} p-5`}>
          <p className="text-[13px] text-[#6b7087]">Online in the last 5 minutes</p>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight">{online.now.total}</p>
          <p className="mt-3 text-[12.5px] text-[#8a90a8]">{online.now.student} students · {online.now.instructor} tutors · {online.now.admin} admins</p>
          <p className="mt-1 text-[12px] text-[#9aa0b8]">{online.last60m.total} in the last hour</p>
        </div>
        <div className={`${card} p-5`}>
          <p className="text-[13px] text-[#6b7087]">Live classes running</p>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight">{liveClasses.length}</p>
          <p className="mt-3 text-[12.5px] text-[#8a90a8]">{inClass} {inClass === 1 ? "person" : "people"} inside now</p>
        </div>
        <div className={`${card} p-5`}>
          <p className="text-[13px] text-[#6b7087]">Revenue today</p>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight">{naira(today.revenue)}</p>
          <p className="mt-3 text-[12.5px] text-[#8a90a8]">{today.payments} {today.payments === 1 ? "payment" : "payments"}</p>
        </div>
        <div className={`${card} p-5`}>
          <p className="text-[13px] text-[#6b7087]">New today</p>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight">{today.signups}</p>
          <p className="mt-3 text-[12.5px] text-[#8a90a8]">{today.enrolments} enrolments · {today.scholarshipApplications} scholarship applications</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title="Live classes" subtitle="Classes running right now">
            {liveClasses.length === 0 ? (
              <Empty text="No class is live at the moment." />
            ) : (
              <ul className="divide-y divide-[#f0f1f7]">
                {liveClasses.map((session) => (
                  <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fde8e8] text-[#d93a3a]"><FiVideo size={18} /></span>
                      <div>
                        <p className="text-[14px] font-medium">{session.title}</p>
                        <p className="text-[12.5px] text-[#8a90a8]">{session.tutor || "Tutor"}{session.cohort ? ` · ${session.cohort}` : ""} · started {timeAgo(session.startsAt)}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#f6f7fb] px-3 py-1 text-[12.5px] font-semibold text-[#4a4f6b]">{session.participants} inside</span>
                  </li>
                ))}
              </ul>
            )}
            {upcomingClasses.length > 0 && (
              <>
                <p className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-wide text-[#8a90a8]">Coming up</p>
                <ul className="space-y-2">
                  {upcomingClasses.map((session) => (
                    <li key={session.id} className="flex items-center justify-between gap-3 text-[13.5px]">
                      <span className="flex min-w-0 items-center gap-2"><FiClock className="shrink-0 text-[#9aa0b8]" /><span className="truncate">{session.title}</span></span>
                      <span className="shrink-0 text-[12.5px] text-[#6b7087]">{startTime(session.startsAt)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>

          <Panel title="Traffic" subtitle="Requests to the app in the last 30 minutes">
            <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-[13.5px] text-[#4a4f6b]">
              <span><b className="text-[#12142b]">{traffic.perMinute}</b> requests a minute</span>
              <span><b className="text-[#12142b]">{traffic.requests}</b> in 30 min</span>
              <span><b className={traffic.errors > 0 ? "text-[#c43232]" : "text-[#12142b]"}>{traffic.errors}</b> failed</span>
              {traffic.serverErrors > 0 && <span><b className="text-[#c43232]">{traffic.serverErrors}</b> server errors</span>}
            </div>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={traffic.series.map((point) => ({ ...point, label: new Date(point.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }))} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5d5fef" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#5d5fef" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8a90a8" }} interval={Math.floor(traffic.series.length / 5)} />
                  <Tooltip {...tooltipStyle} cursor={{ stroke: "#d3d6ea" }} formatter={(value: any, name: any) => [value, name === "errors" ? "Failed" : "Requests"]} />
                  <Area type="monotone" dataKey="requests" stroke="#5d5fef" strokeWidth={2} fill="url(#trafficFill)" />
                  <Area type="monotone" dataKey="errors" stroke="#d93a3a" strokeWidth={1.5} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Activity" subtitle="Latest things that happened on the platform" action={<Link href="/admin/activity" className="text-[13px] font-medium text-[#5d5fef] hover:underline">See everything</Link>}>
            {recent.length === 0 ? (
              <Empty text="Nothing has happened yet." />
            ) : (
              <ul className="space-y-3.5">
                {recent.map((item, index) => {
                  const style = feedStyle[item.type];
                  const Icon = style.icon;
                  return (
                    <li key={`${item.at}-${index}`} className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.tint}`}><Icon size={16} /></span>
                      <p className="min-w-0 flex-1 truncate text-[13.5px]">{item.text}</p>
                      <span className="shrink-0 text-[12px] text-[#8a90a8]">{timeAgo(item.at)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Needs your attention" subtitle="Waiting for an admin">
            <ul className="space-y-2">
              {queueItems.map((item) => (
                <li key={item.text}>
                  <Link href={item.href} className="flex items-center justify-between rounded-xl border border-[#eef0f6] px-4 py-3 text-[13.5px] transition hover:border-[#d3d6ea] hover:bg-[#fafbfe]">
                    <span>{item.text}</span>
                    <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-bold ${item.count > 0 ? "bg-[#f5b942] text-[#4d3300]" : "bg-[#f0f1f7] text-[#8a90a8]"}`}>{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="System" subtitle="This server right now">
            <dl className="space-y-3 text-[13.5px]">
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-[#6b7087]"><FiDatabase size={15} /> Database</dt><dd className={`font-semibold ${system.database === "connected" ? "text-[#13804d]" : "text-[#b42323]"}`}>{system.database === "connected" ? "Connected" : "Disconnected"}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-[#6b7087]"><FiActivity size={15} /> Server uptime</dt><dd className="font-semibold">{duration(system.uptimeSeconds)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-[#6b7087]">Memory</dt><dd className="font-semibold">{system.memoryMb} MB</dd></div>
              <div className="flex items-center justify-between"><dt className="text-[#6b7087]">Environment</dt><dd className="font-semibold capitalize">{system.environment}</dd></div>
            </dl>
            <p className="mt-4 text-[12px] leading-relaxed text-[#9aa0b8]">Online numbers count people who used the app recently on this server. They start again at zero after a restart.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminLivePage;
