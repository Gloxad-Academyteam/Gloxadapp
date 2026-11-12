"use client";

import UserAvatar from "@components/Avatar";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiBookOpen, FiCheckCircle, FiCreditCard, FiUserPlus } from "react-icons/fi";
import { getAnalytics, type TRangeDays } from "@services/admin/metrics";
import { Skeleton } from "../../../components/Skeleton";
import { compact, Empty, ErrorBox, KpiCard, naira, Panel, RangeSelect, tooltipStyle } from "../shared";

const axis = { fontSize: 12, fill: "#8a90a8" };
const label = (text: string) => text.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const BreakdownList = ({ data, colors }: { data: Record<string, number>; colors?: Record<string, string> }) => {
  const entries = Object.entries(data).filter(([, count]) => count > 0);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) return <Empty text="Nothing recorded yet." />;
  return (
    <ul className="space-y-3.5">
      {entries.map(([key, count]) => (
        <li key={key}>
          <div className="mb-1.5 flex items-center justify-between text-[13.5px]">
            <span className="text-[#4a4f6b]">{label(key)}</span>
            <span className="font-semibold">{count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#eef0f6]">
            <div className="h-full rounded-full" style={{ width: `${Math.max((count / total) * 100, 3)}%`, backgroundColor: colors?.[key] || "#5d5fef" }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

const AdminAnalyticsPage = () => {
  const [days, setDays] = useState<TRangeDays>(30);
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["admin.analytics", days], queryFn: () => getAnalytics(days), staleTime: 30_000 });

  const header = (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[24px] font-semibold tracking-tight text-[#12142b]">Analytics</h2>
        <p className="text-[14px] text-[#6b7087]">Real numbers from your platform, compared with the period before.</p>
      </div>
      <RangeSelect value={days} onChange={setDays} />
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        {header}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-2xl" />)}</div>
        <Skeleton className="mt-6 h-[340px] rounded-2xl" />
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

  const { totals, period, series, engagement, courseStatus, topCourses, topTutors, programme } = data;
  const hasRevenue = series.revenue.some((point) => point.value > 0);
  const hasSignups = series.signups.some((point) => point.total > 0);
  const hasEnrolments = series.enrolments.some((point) => point.value > 0);
  const tickEvery = series.revenue.length > 31 ? 0 : Math.max(Math.floor(series.revenue.length / 8) - 1, 0);
  const activeTotal = engagement.activeStudents + engagement.activeTutors;
  const everyone = activeTotal + engagement.passiveStudents + engagement.passiveTutors;

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10">
      {header}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Revenue" value={naira(period.revenue)} change={period.revenueChange} hint={`${period.transactions} successful payments`} icon={FiCreditCard} tint="bg-[#efe9ff] text-[#6a3fd0]" />
        <KpiCard label="New members" value={`${period.newUsers}`} change={period.newUsersChange} hint={`${totals.users} in total`} icon={FiUserPlus} tint="bg-[#e9eaff] text-[#4a4cd6]" />
        <KpiCard label="Enrolments" value={`${period.enrolments}`} change={period.enrolmentsChange} hint={`${totals.enrolments} all time`} icon={FiBookOpen} tint="bg-[#fff1df] text-[#b8650b]" />
        <KpiCard label="Completion rate" value={totals.completionRate === null ? "No data yet" : `${totals.completionRate}%`} hint={`${totals.certificatesIssued} certificates issued`} icon={FiCheckCircle} tint="bg-[#e3f6ec] text-[#13804d]" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Revenue" subtitle={`${naira(totals.revenueAllTime)} earned all time`} action={<Link href="/admin/finance" className="text-[13px] font-medium text-[#5d5fef] hover:underline">Finance</Link>}>
          <div className="h-[280px]">
            {!hasRevenue ? <Empty text="No payments in this period." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.revenue} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="anRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5d5fef" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#5d5fef" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axis} interval={tickEvery} />
                  <YAxis axisLine={false} tickLine={false} tick={axis} tickFormatter={(v) => compact(Number(v))} />
                  <Tooltip {...tooltipStyle} cursor={{ stroke: "#d3d6ea" }} formatter={(value: any) => [naira(Number(value)), "Revenue"]} />
                  <Area type="monotone" dataKey="value" stroke="#5d5fef" strokeWidth={2.5} fill="url(#anRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="New members" subtitle="Students and tutors who joined">
          <div className="h-[280px]">
            {!hasSignups ? <Empty text="Nobody joined in this period." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series.signups} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axis} interval={tickEvery} />
                  <YAxis axisLine={false} tickLine={false} tick={axis} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} cursor={{ fill: "#f3f4fb" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="students" name="Students" stackId="s" fill="#5d5fef" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="tutors" name="Tutors" stackId="s" fill="#2f80ed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Enrolments" subtitle="Learners joining courses">
          <div className="h-[260px]">
            {!hasEnrolments ? <Empty text="No enrolments in this period." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.enrolments} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="anEnrol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#13a36b" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#13a36b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axis} interval={tickEvery} />
                  <YAxis axisLine={false} tickLine={false} tick={axis} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} cursor={{ stroke: "#d3d6ea" }} formatter={(value: any) => [value, "Enrolments"]} />
                  <Area type="monotone" dataKey="value" stroke="#13a36b" strokeWidth={2.5} fill="url(#anEnrol)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Engagement" subtitle={`Signed in during the last ${engagement.windowDays} days`}>
          {everyone === 0 ? <Empty text="No members yet." /> : (
            <>
              <div className="mb-5 flex items-end gap-2">
                <span className="text-[34px] font-semibold leading-none tracking-tight">{Math.round((activeTotal / everyone) * 100)}%</span>
                <span className="pb-1 text-[13px] text-[#6b7087]">of members are active</span>
              </div>
              <BreakdownList
                data={{ "Active students": engagement.activeStudents, "Active tutors": engagement.activeTutors, "Inactive students": engagement.passiveStudents, "Inactive tutors": engagement.passiveTutors }}
                colors={{ "Active students": "#5d5fef", "Active tutors": "#2f80ed", "Inactive students": "#c9cbf8", "Inactive tutors": "#bcd9f8" }}
              />
            </>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Top courses" subtitle="By enrolments, all time">
          {topCourses.length === 0 ? <Empty text="No enrolments yet." /> : (
            <ul className="space-y-4">
              {topCourses.map((course, index) => (
                <li key={course.id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f4fb] text-[13px] font-semibold text-[#4a4f6b]">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{course.title}</p>
                    <p className="text-[12.5px] text-[#8a90a8]">{course.enrolments} {course.enrolments === 1 ? "learner" : "learners"} · {naira(course.revenue)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Top tutors" subtitle="By learners taught">
          {topTutors.length === 0 ? <Empty text="No tutor activity yet." /> : (
            <ul className="space-y-4">
              {topTutors.map((tutor) => (
                <li key={tutor.id} className="flex items-center gap-3">
                  <UserAvatar src={tutor.avatar} className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium">{tutor.name}</p>
                    <p className="text-[12.5px] text-[#8a90a8]">{tutor.students} learners · {tutor.courses} {tutor.courses === 1 ? "course" : "courses"}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Courses by status" subtitle={`${Object.values(courseStatus).reduce((a, b) => a + b, 0)} courses`}>
          <BreakdownList data={courseStatus} colors={{ published: "#13a36b", pending: "#f5b942", draft: "#b3b8cf", rejected: "#d93a3a" }} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Trimester enrolments" subtitle={`${totals.cohortsRunning} cohorts running`}>
          <BreakdownList data={programme.enrolmentsByStatus} colors={{ active: "#13a36b", completed: "#5d5fef", suspended: "#f5b942", withdrawn: "#b3b8cf" }} />
        </Panel>
        <Panel title="Scholarship applications" subtitle="By where they are in review">
          <BreakdownList data={programme.scholarshipApplicationsByStatus} colors={{ approved: "#13a36b", rejected: "#d93a3a", shortlisted: "#5d5fef", under_review: "#f5b942", submitted: "#2f80ed", withdrawn: "#b3b8cf" }} />
        </Panel>
        <Panel title="Live classes" subtitle="In this period">
          <p className="text-[34px] font-semibold leading-none tracking-tight">{totals.sessionsHeld}</p>
          <p className="mt-2 text-[13px] text-[#6b7087]">classes held</p>
          <Link href="/admin/live" className="mt-5 inline-block text-[13px] font-medium text-[#5d5fef] hover:underline">See what is live now</Link>
        </Panel>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
