"use client";

import React, { useState, useEffect } from "react";
import { FiUsers, FiUser, FiBook, FiDollarSign, FiCheckSquare, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AiOutlineAppstore } from "react-icons/ai";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "@services/admin/dashboard";
import axiosInstance from "@utils/axiosInstance";
import Link from "next/link";
import { DashboardMetricCardSkeleton, TableSkeleton, Skeleton } from "../../../components/Skeleton";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regPage, setRegPage] = useState(1);
  const [regTotal, setRegTotal] = useState(0);
  const [regTotalPages, setRegTotalPages] = useState(1);
  const [regLoading, setRegLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => { setStats(res.data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const fetchRegistrations = (page: number) => {
    setRegLoading(true);
    axiosInstance.get(`/admin/recent-registrations?page=${page}&limit=5`)
      .then(res => {
        setRegistrations(res.data.users || []);
        setRegTotal(res.data.total || 0);
        setRegTotalPages(res.data.totalPages || 1);
        setRegPage(page);
      })
      .catch(console.error)
      .finally(() => setRegLoading(false));
  };

  useEffect(() => { fetchRegistrations(1); }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-[#fcfcfd] p-6 lg:p-10 space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[340px] rounded-[20px]" />
          <Skeleton className="h-[340px] rounded-[20px]" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }
  if (!stats) return <div className="p-10">Failed to load stats.</div>;

  const m = stats.metrics || {};
  const totalAll = Math.max(1, m.activeStudents + m.activeTutors + m.passiveStudents + m.passiveTutors);
  const activeStudentPct = Math.round(((m.activeStudents || 0) / totalAll) * 100);
  const activeTutorPct = Math.round(((m.activeTutors || 0) / totalAll) * 100);
  const passiveStudentPct = Math.round(((m.passiveStudents || 0) / totalAll) * 100);
  const passiveTutorPct = Math.round(((m.passiveTutors || 0) / totalAll) * 100);

  return (
    <div className="w-full pb-10">
      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#3498db] text-white p-6 rounded-[12px] flex items-start justify-between shadow-sm h-[140px]">
          <div className="flex flex-col justify-between h-full">
            <p className="text-[15px] font-medium opacity-90">Total Number of Student</p>
            <h2 className="text-[32px] font-bold mt-2">{m.totalStudents || 0}</h2>
            <Link href="/admin/students" className="text-[13px] hover:underline flex items-center mt-1">View details &rarr;</Link>
          </div>
          <div className="text-[24px]"><AiOutlineAppstore /></div>
        </div>
        
        <div className="bg-white text-[#202127] border border-[#e2e8f0] p-6 rounded-[12px] flex items-start justify-between shadow-sm h-[140px]">
          <div className="flex flex-col justify-between h-full">
            <p className="text-[15px] font-medium text-[#717480]">Total Number of Tutors</p>
            <h2 className="text-[32px] font-bold mt-2">{m.totalTutors || 0}</h2>
            <Link href="/admin/tutors" className="text-[13px] text-[#202127] hover:underline flex items-center mt-1">View details &rarr;</Link>
          </div>
          <div className="text-[24px] text-[#202127]"><FiUser /></div>
        </div>

        <div className="bg-white text-[#202127] border border-[#e2e8f0] p-6 rounded-[12px] flex items-start justify-between shadow-sm h-[140px]">
          <div className="flex flex-col justify-between h-full">
            <p className="text-[15px] font-medium text-[#717480]">Total Number of Courses</p>
            <h2 className="text-[32px] font-bold mt-2">{m.totalCourses || 0}</h2>
            <Link href="/admin/courses" className="text-[13px] text-[#202127] hover:underline flex items-center mt-1">View details &rarr;</Link>
          </div>
          <div className="text-[24px] text-[#202127]"><FiBook /></div>
        </div>

        <div className="bg-white text-[#202127] border border-[#e2e8f0] p-6 rounded-[12px] flex items-start justify-between shadow-sm h-[140px]">
          <div className="flex flex-col justify-between h-full">
            <p className="text-[15px] font-medium text-[#717480]">Total Number of Courses Sold</p>
            <h2 className="text-[32px] font-bold mt-2">{m.totalCoursesSold || 0}</h2>
            <Link href="/admin/finance" className="text-[13px] text-[#202127] hover:underline flex items-center mt-1">View details &rarr;</Link>
          </div>
          <div className="text-[24px] text-[#202127]"><FiUsers /></div>
        </div>

        <div className="bg-white text-[#202127] border border-[#e2e8f0] p-6 rounded-[12px] flex items-start justify-between shadow-sm h-[140px]">
          <div className="flex flex-col justify-between h-full">
            <p className="text-[15px] font-medium text-[#717480]">Total Revenue</p>
            <h2 className="text-[32px] font-bold mt-2">&#8358;{(m.totalRevenue || 0).toLocaleString()}</h2>
            <Link href="/admin/finance" className="text-[13px] text-[#202127] hover:underline flex items-center mt-1">View details &rarr;</Link>
          </div>
          <div className="text-[24px] text-[#202127]"><FiDollarSign /></div>
        </div>

        <div className="bg-white text-[#202127] border border-[#e2e8f0] p-6 rounded-[12px] flex items-start justify-between shadow-sm h-[140px]">
          <div className="flex flex-col justify-between h-full">
            <p className="text-[15px] font-medium text-[#717480]">Number of Courses Completed</p>
            <h2 className="text-[32px] font-bold mt-2">{m.coursesCompleted || 0}</h2>
            <a href="#" className="text-[13px] text-[#202127] hover:underline flex items-center mt-1">View details &rarr;</a>
          </div>
          <div className="text-[24px] text-[#202127]"><FiCheckSquare /></div>
        </div>
      </div>

      {/* Middle Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-[18px] text-[#202127]">Revenue</h3>
            <select className="border-none bg-transparent text-[14px] text-[#717480] outline-none cursor-pointer">
              <option>This year</option>
            </select>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueAnalytics || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#A0AEC0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#A0AEC0" }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#202127", borderRadius: "8px", border: "none", color: "white", padding: "8px 12px" }}
                  itemStyle={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
                  labelStyle={{ color: "#A0AEC0", fontSize: "12px", marginBottom: "4px" }}
                  formatter={(value: any) => [`₦${value.toLocaleString()}`, ""]}
                />
                <Line type="monotone" dataKey="value" stroke="#5d5fef" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#202127", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Panel (replaces gender gauge) */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm flex flex-col">
          <div className="w-full text-left mb-4">
            <h3 className="font-bold text-[18px] text-[#202127]">User Activity</h3>
            <p className="text-[14px] text-[#717480] mt-2 leading-relaxed">
              Active vs passive users based on activity in the last 30 days
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {[
              { label: "Active Students", count: m.activeStudents || 0, pct: activeStudentPct, color: "#3498db" },
              { label: "Active Tutors", count: m.activeTutors || 0, pct: activeTutorPct, color: "#181C7B" },
              { label: "Passive Students", count: m.passiveStudents || 0, pct: passiveStudentPct, color: "#74b9ff" },
              { label: "Passive Tutors", count: m.passiveTutors || 0, pct: passiveTutorPct, color: "#a2c9f4" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-[#4e515c]">{item.label}</span>
                  <span className="font-bold text-[#202127]">{item.count}</span>
                </div>
                <div className="w-full bg-[#e2e8f0] h-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(item.pct, 2)}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Tutors Row */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm mb-8">
        <h3 className="font-bold text-[18px] text-[#202127] mb-6">Top Tutors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {(stats.topTutors || []).map((tutor: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#e2e8f0] overflow-hidden flex items-center justify-center font-bold text-[#181C7B] text-[16px] shrink-0">
                {tutor.img ? <img src={tutor.img} alt={tutor.name} className="w-full h-full object-cover" /> : tutor.name?.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-[#202127]">{tutor.name}</h4>
                <p className="text-[13px] text-[#717480] mt-0.5">{tutor.courses}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real User Registrations Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h3 className="font-bold text-[18px] text-[#202127] mb-4 sm:mb-0">Recent User Registrations</h3>
          <div className="text-[14px] text-[#717480] flex items-center gap-4">
            <span>{regTotal === 0 ? "0" : `${(regPage - 1) * 5 + 1}–${Math.min(regPage * 5, regTotal)}`} of {regTotal}</span>
            <div className="flex gap-2">
              <button
                onClick={() => regPage > 1 && fetchRegistrations(regPage - 1)}
                disabled={regPage <= 1}
                className="hover:text-black transition-colors disabled:opacity-40"
              ><FiChevronLeft /></button>
              <button
                onClick={() => regPage < regTotalPages && fetchRegistrations(regPage + 1)}
                disabled={regPage >= regTotalPages}
                className="hover:text-black transition-colors disabled:opacity-40"
              ><FiChevronRight /></button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-[#202127]">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="pb-4 font-normal text-[#717480] whitespace-nowrap px-4">Name</th>
                <th className="pb-4 font-normal text-[#717480] whitespace-nowrap px-4">Email</th>
                <th className="pb-4 font-normal text-[#717480] whitespace-nowrap px-4">Role</th>
                <th className="pb-4 font-normal text-[#717480] whitespace-nowrap px-4">Phone</th>
                <th className="pb-4 font-normal text-[#717480] whitespace-nowrap px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {regLoading ? (
                <tr><td colSpan={5} className="py-6 text-center text-[#717480]">Loading...</td></tr>
              ) : registrations.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-[#717480]">No registrations found.</td></tr>
              ) : registrations.map((u: any) => (
                <tr key={u._id} className="border-b border-[#f0f4f8] last:border-none hover:bg-[#f8fafc]">
                  <td className="py-4 px-4 whitespace-nowrap font-medium">{u.firstName} {u.lastName}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-[#717480]">{u.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${u.role === "admin" ? "bg-[#fef3c7] text-[#d97706]" : u.role === "instructor" ? "bg-[#e0e7ff] text-[#4338ca]" : "bg-[#dcfce7] text-[#16a34a]"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-[#717480]">{u.phoneNumber || "N/A"}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-[#717480]">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
