"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiArrowUpRight, FiBook, FiCheckCircle, FiChevronLeft, FiChevronRight, FiDollarSign, FiShoppingBag, FiUser, FiUsers } from "react-icons/fi";
import { getDashboardStats, type TDashboardStats } from "@services/admin/dashboard";
import useAuth from "@hooks/useAuth";
import axiosInstance from "@utils/axiosInstance";
import { Skeleton } from "../../../components/Skeleton";

const card = "rounded-2xl border border-[#e8eaf3] bg-white shadow-[0_1px_2px_rgba(18,20,43,0.04)]";
const naira = (value: number) => `₦${(value || 0).toLocaleString()}`;
const compact = (value: number) => (value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`);

type TStat = { label: string; value: string; href: string; icon: React.ElementType; tint: string };

const StatCard = ({ stat }: { stat: TStat }) => {
  const Icon = stat.icon;
  return (
    <Link href={stat.href} className={`${card} group flex flex-col gap-4 p-5 transition hover:border-[#d3d6ea] hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tint}`}><Icon size={19} /></span>
        <FiArrowUpRight className="text-[#b4b9cc] transition group-hover:text-[#5d5fef]" size={18} />
      </div>
      <div>
        <p className="text-[28px] font-semibold leading-none tracking-tight text-[#12142b]">{stat.value}</p>
        <p className="mt-2 text-[13px] text-[#6b7087]">{stat.label}</p>
      </div>
    </Link>
  );
};

const roleStyle = (role: string) =>
  role === "admin" ? "bg-[#fff4dc] text-[#a86a00]" : role === "instructor" ? "bg-[#e9eaff] text-[#3f41c4]" : "bg-[#e3f6ec] text-[#13804d]";

const AdminDashboardPage = () => {
  const { authenticatedUser } = useAuth();
  const [stats, setStats] = useState<TDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regPage, setRegPage] = useState(1);
  const [regTotal, setRegTotal] = useState(0);
  const [regTotalPages, setRegTotalPages] = useState(1);
  const [regLoading, setRegLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const fetchRegistrations = (page: number) => {
    setRegLoading(true);
    axiosInstance
      .get(`/admin/recent-registrations?page=${page}&limit=6`)
      .then((res) => {
        setRegistrations(res.data.users || []);
        setRegTotal(res.data.total || 0);
        setRegTotalPages(res.data.totalPages || 1);
        setRegPage(page);
      })
      .catch(() => setRegistrations([]))
      .finally(() => setRegLoading(false));
  };

  useEffect(() => {
    fetchRegistrations(1);
  }, []);

  const firstName = authenticatedUser?.firstName || authenticatedUser?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const header = (
    <div className="mb-6 flex flex-col gap-1">
      <h2 className="text-[24px] font-semibold tracking-tight text-[#12142b]">{greeting}, {firstName}</h2>
      <p className="text-[14px] text-[#6b7087]">Here is how Gloxad Academy is doing today.</p>
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-[132px] rounded-2xl" />)}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[360px] rounded-2xl lg:col-span-2" />
          <Skeleton className="h-[360px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (failed || !stats) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        {header}
        <div className={`${card} p-10 text-center`}>
          <p className="text-[16px] font-semibold">We could not load the dashboard</p>
          <p className="mt-1 text-[14px] text-[#6b7087]">Check your connection and try again.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-5 h-10 rounded-lg bg-[#12142b] px-5 text-[14px] font-semibold text-white">Reload</button>
        </div>
      </div>
    );
  }

  const m = stats.metrics;
  const statCards: TStat[] = [
    { label: "Students", value: `${m.totalStudents || 0}`, href: "/admin/students", icon: FiUsers, tint: "bg-[#e9eaff] text-[#4a4cd6]" },
    { label: "Tutors", value: `${m.totalTutors || 0}`, href: "/admin/tutors", icon: FiUser, tint: "bg-[#e1f1ff] text-[#1f6fc4]" },
    { label: "Courses", value: `${m.totalCourses || 0}`, href: "/admin/courses", icon: FiBook, tint: "bg-[#fff1df] text-[#b8650b]" },
    { label: "Courses sold", value: `${m.totalCoursesSold || 0}`, href: "/admin/finance", icon: FiShoppingBag, tint: "bg-[#fde8ef] text-[#c02a5b]" },
    { label: "Completed courses", value: `${m.coursesCompleted || 0}`, href: "/admin/courses", icon: FiCheckCircle, tint: "bg-[#e3f6ec] text-[#13804d]" },
    { label: "Total revenue", value: naira(m.totalRevenue), href: "/admin/finance", icon: FiDollarSign, tint: "bg-[#efe9ff] text-[#6a3fd0]" },
  ];

  const attention = [
    { count: m.pendingTutors || 0, text: "tutor applications to review", href: "/admin/tutors" },
    { count: m.pendingCourses || 0, text: "courses waiting for approval", href: "/admin/courses" },
  ].filter((item) => item.count > 0);

  const totalUsers = Math.max(1, (m.activeStudents || 0) + (m.activeTutors || 0) + (m.passiveStudents || 0) + (m.passiveTutors || 0));
  const activity = [
    { label: "Active students", count: m.activeStudents || 0, color: "#5d5fef" },
    { label: "Active tutors", count: m.activeTutors || 0, color: "#2f80ed" },
    { label: "Passive students", count: m.passiveStudents || 0, color: "#b3b5f7" },
    { label: "Passive tutors", count: m.passiveTutors || 0, color: "#a9cdf6" },
  ];
  const activeShare = Math.round((((m.activeStudents || 0) + (m.activeTutors || 0)) / totalUsers) * 100);
  const revenue = stats.revenueAnalytics;
  const tutors = stats.topTutors;

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10">
      {header}

      {attention.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {attention.map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex items-center gap-2.5 rounded-xl border border-[#f3dfb3] bg-[#fff8e8] px-4 py-2.5 text-[13.5px] text-[#7a5200] transition hover:bg-[#fff3d6]">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f5b942] px-1.5 text-[12px] font-bold text-[#4d3300]">{item.count}</span>
              {item.text}
              <FiArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className={`${card} p-6 lg:col-span-2`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold tracking-tight">Revenue</h3>
              <p className="text-[13px] text-[#6b7087]">This year, by month</p>
            </div>
            <Link href="/admin/finance" className="text-[13px] font-medium text-[#5d5fef] hover:underline">Open finance</Link>
          </div>
          <div className="h-[290px]">
            {revenue.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[14px] text-[#8a90a8]">No revenue recorded yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5d5fef" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#5d5fef" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a90a8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a90a8" }} tickFormatter={(value) => compact(Number(value))} />
                  <Tooltip
                    cursor={{ stroke: "#d3d6ea" }}
                    contentStyle={{ backgroundColor: "#12142b", borderRadius: 10, border: "none", padding: "8px 12px" }}
                    itemStyle={{ color: "#fff", fontSize: 13, fontWeight: 600 }}
                    labelStyle={{ color: "#9ba0c2", fontSize: 12, marginBottom: 2 }}
                    formatter={(value: any) => [naira(Number(value)), "Revenue"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#5d5fef" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, fill: "#12142b", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className={`${card} flex flex-col p-6`}>
          <h3 className="text-[16px] font-semibold tracking-tight">User activity</h3>
          <p className="text-[13px] text-[#6b7087]">Last 30 days</p>
          {activity.every((item) => item.count === 0) ? (
            <p className="mt-6 text-[14px] leading-relaxed text-[#8a90a8]">Activity numbers appear here once learners and tutors start using the platform.</p>
          ) : (
            <>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-[34px] font-semibold leading-none tracking-tight">{activeShare}%</span>
            <span className="pb-1 text-[13px] text-[#6b7087]">of users are active</span>
          </div>
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-[#eef0f6]">
            {activity.map((item) => (
              <span key={item.label} style={{ width: `${(item.count / totalUsers) * 100}%`, backgroundColor: item.color }} />
            ))}
          </div>
          <ul className="mt-5 space-y-3">
            {activity.map((item) => (
              <li key={item.label} className="flex items-center justify-between text-[13.5px]">
                <span className="flex items-center gap-2.5 text-[#4a4f6b]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span>
                <span className="font-semibold">{item.count}</span>
              </li>
            ))}
          </ul>
            </>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className={`${card} p-6`}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold tracking-tight">Top tutors</h3>
            <Link href="/admin/tutors" className="text-[13px] font-medium text-[#5d5fef] hover:underline">View all</Link>
          </div>
          {tutors.length === 0 ? (
            <p className="text-[14px] text-[#8a90a8]">No tutor activity yet.</p>
          ) : (
            <ul className="space-y-4">
              {tutors.map((tutor, index) => (
                <li key={`${tutor.name}-${index}`} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e9eaff] text-[14px] font-semibold text-[#3f41c4]">
                    {tutor.img ? <img src={tutor.img} alt="" className="h-full w-full object-cover" /> : tutor.name?.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium">{tutor.name}</p>
                    <p className="truncate text-[12.5px] text-[#6b7087]">{tutor.courses}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} p-6 xl:col-span-2`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold tracking-tight">Recent registrations</h3>
              <p className="text-[13px] text-[#6b7087]">{regTotal} people have joined</p>
            </div>
            <div className="flex items-center gap-1 text-[13px] text-[#6b7087]">
              <span className="mr-2">{regPage} / {regTotalPages}</span>
              <button type="button" aria-label="Previous page" onClick={() => regPage > 1 && fetchRegistrations(regPage - 1)} disabled={regPage <= 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronLeft /></button>
              <button type="button" aria-label="Next page" onClick={() => regPage < regTotalPages && fetchRegistrations(regPage + 1)} disabled={regPage >= regTotalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronRight /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#eef0f6] text-[12px] uppercase tracking-wide text-[#8a90a8]">
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Phone</th>
                  <th className="py-3 text-right font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {regLoading ? (
                  <tr><td colSpan={4} className="py-8 text-center text-[#8a90a8]">Loading...</td></tr>
                ) : registrations.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-[#8a90a8]">No registrations yet.</td></tr>
                ) : (
                  registrations.map((user: any) => (
                    <tr key={user._id} className="border-b border-[#f3f4f9] last:border-none">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-[12.5px] text-[#8a90a8]">{user.email}</p>
                      </td>
                      <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${roleStyle(user.role)}`}>{user.role}</span></td>
                      <td className="py-3 pr-4 text-[#6b7087]">{user.phoneNumber || "Not set"}</td>
                      <td className="py-3 text-right text-[#6b7087]">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
