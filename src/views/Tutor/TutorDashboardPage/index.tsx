"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboardStats } from "@services/tutor";
import { AreaChart, Area, LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaGraduationCap, FaBolt, FaCheckCircle, FaMoneyBillWave, FaStar } from "react-icons/fa";
import { HiCheckCircle } from "react-icons/hi";
import useAuth from "@hooks/useAuth";
import { DashboardMetricCardSkeleton, Skeleton } from "../../../components/Skeleton";

const TutorDashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"12Months" | "30Days">("12Months");
  const { authenticatedUser } = useAuth();
  const router = useRouter();
  const user: any = authenticatedUser;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch tutor stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 xl:p-12 w-full max-w-[1400px] mx-auto space-y-8">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[340px] rounded-[20px]" />
          <Skeleton className="h-[340px] rounded-[20px]" />
        </div>
      </div>
    );
  }

  const tutorName = stats?.tutorName || user?.name || user?.firstName || "Tutor";
  const profileCompletion = stats?.profileCompletionPercentage ?? 0;

  const totalCourses = stats?.metrics?.totalCoursesUploaded ?? 0;
  const activeCourses = stats?.metrics?.activeCourses ?? 0;
  const completedCourses = stats?.metrics?.completedCourses ?? 0;
  const totalEarnings = stats?.metrics?.totalEarnings ? `$${Number(stats.metrics.totalEarnings).toLocaleString()}` : "$0";

  const metrics = [
    {
      title: "TOTAL COURSES UPLOADED",
      value: totalCourses,
      icon: FaGraduationCap,
      iconBg: "bg-[#eeecff]",
      iconColor: "text-[#4c40e6]",
      badge: "~ 12%",
      badgeBg: "bg-[#e3f2fd] text-[#3e92cc]",
    },
    {
      title: "ACTIVE COURSES",
      value: activeCourses,
      icon: FaBolt,
      iconBg: "bg-[#e0f7fa]",
      iconColor: "text-[#00b8d9]",
      badge: "~ 4%",
      badgeBg: "bg-[#e3f2fd] text-[#3e92cc]",
    },
    {
      title: "COMPLETED COURSES",
      value: completedCourses,
      icon: FaCheckCircle,
      iconBg: "bg-[#fff8e1]",
      iconColor: "text-[#ffab00]",
      badge: "- 0%",
      badgeBg: "bg-[#f4f5f7] text-[#8993a4]",
    },
    {
      title: "TOTAL EARNINGS",
      value: totalEarnings,
      icon: FaMoneyBillWave,
      iconBg: "bg-[#e3f2fd]",
      iconColor: "text-[#3e92cc]",
      badge: "~ 28%",
      badgeBg: "bg-[#e3f2fd] text-[#3e92cc]",
    },
  ];

  const revenueData = stats?.revenueAnalytics || [];
  const overallScore = stats?.courseRatings?.overallScore ?? 0;
  const ratingBreakdown = stats?.courseRatings?.ratingBreakdown || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };
  const trendData = (stats?.courseRatings?.recentTrend || []).map((v: number, i: number) => ({ x: i, y: v }));

  return (
    <div className="p-4 sm:p-6 md:p-8 xl:p-12 w-full max-w-[1400px] mx-auto text-[#202127]">
      {/* 1. Welcome Banner Card */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between rounded-[20px] border border-[#f0f4f8] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#00b8d9]">
            {user?.avatar || user?.avatarUrl ? (
              <img src={user.avatar || user.avatarUrl} alt="User avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#26a69a] text-white font-bold text-2xl">
                {tutorName.charAt(0)}
              </div>
            )}
            <HiCheckCircle className="absolute bottom-0 right-0 text-[20px] text-[#3e92cc] bg-white rounded-full" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#202127]">Welcome back, {tutorName}!</h1>
            <p className="text-[13px] text-[#8993a4]">You're doing great! Complete your profile to reach higher limits.</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-[280px]">
          <div className="mb-1 flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#8993a4]">
            <span>PROFILE SETUP</span>
            <span className="text-[#3e92cc] font-bold">{profileCompletion}% Completed</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#e3f2fd] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3e92cc] transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Metric Cards Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((card, i) => (
          <div key={i} className="flex flex-col justify-between rounded-[20px] border border-[#f0f4f8] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <card.icon className="text-[20px]" />
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${card.badgeBg}`}>
                {card.badge}
              </span>
            </div>
            <div className="mt-5">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#8993a4]">{card.title}</p>
              <h3 className="text-[26px] font-extrabold text-[#202127]">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Analytics & Rating Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Area Chart - Revenue Analytics */}
        <div className="rounded-[20px] border border-[#f0f4f8] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:col-span-2">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-bold text-[#202127]">Revenue Analytics</h3>
              <p className="text-[13px] text-[#8993a4]">Monthly breakdown of your platform earnings</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeRange("12Months")}
                className={`rounded-xl px-4 py-1.5 text-[12px] font-bold transition-colors ${
                  timeRange === "12Months" ? "bg-[#eeecff] text-[#4c40e6]" : "text-[#8993a4] hover:text-[#202127]"
                }`}
              >
                12 Months
              </button>
              <button
                onClick={() => setTimeRange("30Days")}
                className={`rounded-xl px-4 py-1.5 text-[12px] font-bold transition-colors ${
                  timeRange === "30Days" ? "bg-[#eeecff] text-[#4c40e6]" : "text-[#8993a4] hover:text-[#202127]"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3e92cc" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3e92cc" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#8993a4", fontWeight: "bold" }}
                    dy={10}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg bg-[#0c1a30] px-3 py-2 text-white shadow-lg">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">REVENUE</p>
                            <p className="text-[13px] font-bold">${Number(payload[0].value).toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3e92cc"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    dot={{ r: 4, fill: "#3e92cc", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, fill: "#07004d" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#f8fafc] text-[13px] font-medium text-[#8993a4]">
                No revenue analytics available yet
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Course Ratings */}
        <div className="flex flex-col justify-between rounded-[20px] border border-[#f0f4f8] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div>
            <h3 className="mb-6 text-[18px] font-bold text-[#202127]">Course Ratings</h3>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[44px] font-extrabold leading-none text-[#202127]">{overallScore}</h2>
                <div className="mt-1 flex gap-1 text-[#ffab00]">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-[16px]" />
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8993a4]">Overall Score</p>
              </div>

              <div className="h-14 w-28 text-right">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="70%">
                    <LineChart data={trendData}>
                      <Line type="monotone" dataKey="y" stroke="#3e92cc" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-end text-[10px] text-[#8993a4]">--</div>
                )}
                <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#8993a4]">RECENT TREND</p>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              {[
                { star: 5, pct: ratingBreakdown[5] || 0 },
                { star: 4, pct: ratingBreakdown[4] || 0 },
                { star: 3, pct: ratingBreakdown[3] || 0 },
                { star: 2, pct: ratingBreakdown[2] || 0 },
                { star: 1, pct: ratingBreakdown[1] || 0 },
              ].map(({ star, pct }) => (
                <div key={star} className="flex items-center gap-3 text-[12px] font-bold text-[#8993a4]">
                  <span className="w-12">{star} Stars</span>
                  <div className="h-2 flex-1 rounded-full bg-[#f4f5f7] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#3e92cc]"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right text-[#202127] font-bold">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard?tab=reviews")}
            className="w-full rounded-xl border border-[#07004d] py-3 text-[13px] font-bold text-[#07004d] hover:bg-[#f4f5f7] transition-colors"
          >
            View Detailed Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboardPage;
