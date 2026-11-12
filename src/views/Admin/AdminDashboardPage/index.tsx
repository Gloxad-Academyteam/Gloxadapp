"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiArrowUpRight, FiBookOpen, FiCheckCircle, FiChevronLeft, FiChevronRight, FiCreditCard, FiUserPlus } from "react-icons/fi";
import useAuth from "@hooks/useAuth";
import axiosInstance from "@utils/axiosInstance";
import { getAnalytics, getLiveMetrics, type TRangeDays } from "@services/admin/metrics";
import { Skeleton } from "../../../components/Skeleton";
import { card, compact, Empty, ErrorBox, KpiCard, naira, Panel, RangeSelect, timeAgo, tooltipStyle } from "../shared";

const roleStyle = (role: string) =>
  role === "admin" ? "bg-[#fff4dc] text-[#a86a00]" : role === "instructor" ? "bg-[#e9eaff] text-[#3f41c4]" : "bg-[#e3f6ec] text-[#13804d]";
const roleName = (role: string) => (role === "instructor" ? "Tutor" : role.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()));

const AdminDashboardPage = () => {
  const { authenticatedUser } = useAuth();
  const [days, setDays] = useState<TRangeDays>(30);
  const analytics = useQuery({ queryKey: ["admin.analytics", days], queryFn: () => getAnalytics(days), staleTime: 30_000 });
  const live = useQuery({ queryKey: ["admin.live"], queryFn: getLiveMetrics, refetchInterval: 15_000, staleTime: 0 });

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regPage, setRegPage] = useState(1);
  const [regTotal, setRegTotal] = useState(0);
  const [regPages, setRegPages] = useState(1);
  const [regLoading, setRegLoading] = useState(true);

  const loadRegistrations = (page: number) => {
    setRegLoading(true);
    axiosInstance
      .get(`/admin/recent-registrations?page=${page}&limit=6`)
      .then((res) => {
        setRegistrations(res.data.users || []);
        setRegTotal(res.data.total ?? res.data.count ?? 0);
        setRegPages(res.data.totalPages || 1);
        setRegPage(page);
      })
      .catch(() => setRegistrations([]))
      .finally(() => setRegLoading(false));
  };
  useEffect(() => loadRegistrations(1), []);

  const firstName = authenticatedUser?.firstName || authenticatedUser?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const header = (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[24px] font-semibold tracking-tight text-[#12142b]">{greeting}, {firstName}</h2>
        <p className="text-[14px] text-[#6b7087]">Here is how Gloxad Academy is doing.</p>
      </div>
      <RangeSelect value={days} onChange={setDays} />
    </div>
  );

  if (analytics.isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        {header}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-2xl" />)}</div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3"><Skeleton className="h-[360px] rounded-2xl lg:col-span-2" /><Skeleton className="h-[360px] rounded-2xl" /></div>
      </div>
    );
  }
  if (analytics.isError || !analytics.data) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        {header}
        <ErrorBox onRetry={() => analytics.refetch()} />
      </div>
    );
  }

  const { totals, period, series, topTutors } = analytics.data;
  const metrics = live.data;
  const hasRevenue = series.revenue.some((point) => point.value > 0);
  const tickEvery = series.revenue.length > 31 ? 0 : Math.max(Math.floor(series.revenue.length / 8) - 1, 0);
  const attention = metrics
    ? [
        { count: metrics.queue.pendingTutors, text: "tutor applications to review", href: "/admin/tutors" },
        { count: metrics.queue.pendingCourses, text: "courses waiting for approval", href: "/admin/courses" },
        { count: metrics.queue.scholarshipApplications, text: "scholarship applications", href: "/admin/live" },
      ].filter((item) => item.count > 0)
    : [];

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10">
      {header}

      {/* Live strip */}
      <Link href="/admin/live" className={`${card} mb-4 flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 transition hover:border-[#d3d6ea]`}>
        <span className="flex items-center gap-2 text-[13px] font-semibold text-[#12142b]">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]" /></span>
          Live
        </span>
        <span className="text-[13.5px] text-[#4a4f6b]"><b className="text-[#12142b]">{metrics?.online.now.total ?? "-"}</b> online now</span>
        <span className="text-[13.5px] text-[#4a4f6b]"><b className="text-[#12142b]">{metrics?.liveClasses.length ?? "-"}</b> live {metrics?.liveClasses.length === 1 ? "class" : "classes"}</span>
        <span className="text-[13.5px] text-[#4a4f6b]"><b className="text-[#12142b]">{metrics ? naira(metrics.today.revenue) : "-"}</b> today</span>
        <span className="text-[13.5px] text-[#4a4f6b]"><b className="text-[#12142b]">{metrics?.today.signups ?? "-"}</b> new today</span>
        <FiArrowUpRight className="ml-auto text-[#9aa0b8]" />
      </Link>

      {attention.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {attention.map((item) => (
            <Link key={item.href + item.text} href={item.href} className="inline-flex items-center gap-2.5 rounded-xl border border-[#f3dfb3] bg-[#fff8e8] px-4 py-2.5 text-[13.5px] text-[#7a5200] transition hover:bg-[#fff3d6]">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f5b942] px-1.5 text-[12px] font-bold text-[#4d3300]">{item.count}</span>
              {item.text}
              <FiArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Revenue" value={naira(period.revenue)} change={period.revenueChange} hint={`${naira(totals.revenueAllTime)} all time`} icon={FiCreditCard} tint="bg-[#efe9ff] text-[#6a3fd0]" />
        <KpiCard label="New members" value={`${period.newUsers}`} change={period.newUsersChange} hint={`${totals.students} students · ${totals.tutors} tutors`} icon={FiUserPlus} tint="bg-[#e9eaff] text-[#4a4cd6]" />
        <KpiCard label="Enrolments" value={`${period.enrolments}`} change={period.enrolmentsChange} hint={`${totals.enrolments} all time`} icon={FiBookOpen} tint="bg-[#fff1df] text-[#b8650b]" />
        <KpiCard label="Completion rate" value={totals.completionRate === null ? "No data yet" : `${totals.completionRate}%`} hint={`${totals.certificatesIssued} certificates issued`} icon={FiCheckCircle} tint="bg-[#e3f6ec] text-[#13804d]" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Revenue" subtitle="Successful payments" action={<Link href="/admin/analytics" className="text-[13px] font-medium text-[#5d5fef] hover:underline">Full analytics</Link>}>
          <div className="h-[290px]">
            {!hasRevenue ? <Empty text="No payments in this period." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.revenue} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5d5fef" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#5d5fef" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a90a8" }} interval={tickEvery} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a90a8" }} tickFormatter={(v) => compact(Number(v))} />
                  <Tooltip {...tooltipStyle} cursor={{ stroke: "#d3d6ea" }} formatter={(value: any) => [naira(Number(value)), "Revenue"]} />
                  <Area type="monotone" dataKey="value" stroke="#5d5fef" strokeWidth={2.5} fill="url(#dashRevenue)" activeDot={{ r: 5, fill: "#12142b", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Latest activity" subtitle="Updates as it happens">
          {!metrics || metrics.recent.length === 0 ? <Empty text="Nothing has happened yet." /> : (
            <ul className="space-y-3.5">
              {metrics.recent.slice(0, 7).map((item, index) => (
                <li key={`${item.at}-${index}`} className="flex items-start justify-between gap-3 text-[13.5px]">
                  <span className="min-w-0 text-[#2b2f4a]">{item.text}</span>
                  <span className="shrink-0 pt-0.5 text-[12px] text-[#8a90a8]">{timeAgo(item.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Top tutors" subtitle="By learners taught" action={<Link href="/admin/tutors" className="text-[13px] font-medium text-[#5d5fef] hover:underline">View all</Link>}>
          {topTutors.length === 0 ? <Empty text="No tutor activity yet." /> : (
            <ul className="space-y-4">
              {topTutors.map((tutor) => (
                <li key={tutor.id} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e9eaff] text-[14px] font-semibold text-[#3f41c4]">
                    {tutor.avatar ? <img src={tutor.avatar} alt="" className="h-full w-full object-cover" onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = "none"; }} /> : tutor.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium">{tutor.name}</p>
                    <p className="text-[12.5px] text-[#8a90a8]">{tutor.students} learners · {tutor.courses} {tutor.courses === 1 ? "course" : "courses"}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          className="xl:col-span-2"
          title="Recent registrations"
          subtitle={`${regTotal} people have joined`}
          action={
            <div className="flex items-center gap-1 text-[13px] text-[#6b7087]">
              <span className="mr-2">{regPage} / {regPages}</span>
              <button type="button" aria-label="Previous page" onClick={() => regPage > 1 && loadRegistrations(regPage - 1)} disabled={regPage <= 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronLeft /></button>
              <button type="button" aria-label="Next page" onClick={() => regPage < regPages && loadRegistrations(regPage + 1)} disabled={regPage >= regPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronRight /></button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#eef0f6] text-[12px] uppercase tracking-wide text-[#8a90a8]">
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 text-right font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {regLoading ? (
                  <tr><td colSpan={3} className="py-8 text-center text-[#8a90a8]">Loading...</td></tr>
                ) : registrations.length === 0 ? (
                  <tr><td colSpan={3} className="py-8 text-center text-[#8a90a8]">No registrations yet.</td></tr>
                ) : (
                  registrations.map((user: any) => (
                    <tr key={user._id} className="border-b border-[#f3f4f9] last:border-none">
                      <td className="py-3 pr-4"><p className="font-medium">{user.firstName} {user.lastName}</p><p className="text-[12.5px] text-[#8a90a8]">{user.email}</p></td>
                      <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${roleStyle(user.role)}`}>{roleName(user.role)}</span></td>
                      <td className="py-3 text-right text-[#6b7087]">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
