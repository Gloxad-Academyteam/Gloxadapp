"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";

const fetchFinance = async () => {
  const { data } = await axiosInstance.get("/admin/finance");
  return data;
};

const FinancePage: React.FC = () => {
  const { data: financeData, isLoading } = useQuery({
    queryKey: ["admin.finance"],
    queryFn: fetchFinance
  });

  if (isLoading) {
    return <div className="p-10 text-[#202127]">Loading finance stats...</div>;
  }

  const {
    totalCoursesSold = 0,
    totalRevenue = 0,
    monthlyProfit = 0,
    coursesUploaded = [],
    coursesSold = [],
    barChartData = []
  } = financeData || {};

  const maxBarValue = Math.max(...barChartData.map((d: any) => d.value), 5000);

  // Dynamic donut: coursesSold count vs coursesUploaded count
  const uploadedCount = coursesUploaded.length || 1;
  const soldPct = Math.round(Math.min((totalCoursesSold / Math.max(uploadedCount, 1)) * 100, 100));
  const pendingPct = 100 - soldPct;
  return (
    <div className="w-full pb-10">

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Total Courses Sold */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 relative overflow-hidden">
          <h3 className="text-[14px] font-bold text-[#202127] mb-1">Total courses Sold</h3>
          <p className="text-[28px] font-bold text-[#181C7B]">{totalCoursesSold}</p>
          {/* Sparkline decoration */}
          <svg className="absolute bottom-0 right-0 w-[80px] h-[30px] text-[#3b82f6] opacity-30" viewBox="0 0 80 30">
            <polyline fill="none" stroke="currentColor" strokeWidth="2" points="0,25 10,20 20,22 30,15 40,18 50,10 60,14 70,8 80,12" />
          </svg>
        </div>

        {/* Revenue Generated */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 relative overflow-hidden">
          <h3 className="text-[14px] font-bold text-[#202127] mb-1">Revenue Generated</h3>
          <p className="text-[28px] font-bold text-[#181C7B]">&#8358;{totalRevenue.toLocaleString()}</p>
          <svg className="absolute bottom-0 right-0 w-[80px] h-[30px] text-[#3b82f6] opacity-30" viewBox="0 0 80 30">
            <polyline fill="none" stroke="currentColor" strokeWidth="2" points="0,20 10,15 20,22 30,12 40,18 50,8 60,16 70,6 80,10" />
          </svg>
        </div>

        {/* Monthly Profit Donut */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 flex items-center gap-6">
          <div>
            <h3 className="text-[14px] font-bold text-[#202127] mb-4">Monthly Profit</h3>
            <div className="relative w-[120px] h-[120px]">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#181C7B" strokeWidth="3"
                  strokeDasharray={`${soldPct} ${pendingPct}`} strokeDashoffset="0" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#60a5fa" strokeWidth="3"
                  strokeDasharray={`${pendingPct} ${soldPct}`} strokeDashoffset={`-${soldPct}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] text-[#A0AEC0] font-bold uppercase">Total</span>
                <span className="text-[18px] font-bold text-[#181C7B]">&#8358;{monthlyProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#181C7B]"></span>
              <span className="text-[12px] text-[#4e515c]">Courses Sold</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]"></span>
              <span className="text-[12px] text-[#4e515c]">Pending courses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#202127]">Total Courses Sold</h3>
          <select className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] px-3 py-1.5 text-[12px] text-[#4e515c] outline-none">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>

        {/* Y-axis labels + bars */}
        <div className="flex items-end gap-0">
          {/* Y-axis */}
          <div className="flex flex-col justify-between h-[200px] pr-2 text-[10px] text-[#A0AEC0] font-medium">
            <span>#5k</span>
            <span>#4k</span>
            <span>#3k</span>
            <span>#2k</span>
            <span>#1k</span>
            <span>#0</span>
          </div>

          {/* Bars */}
          <div className="flex-1 flex items-end gap-2 h-[200px] border-l border-b border-[#e2e8f0] pl-2 pb-1 overflow-x-auto">
            {barChartData.map((item: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full min-w-[20px]">
                <div
                  className="w-full max-w-[28px] rounded-t-[4px] bg-[#181C7B] hover:bg-[#3b82f6] transition-colors cursor-pointer"
                  style={{ height: `${Math.max((item.value / maxBarValue) * 100, 2)}%` }}
                  title={`${item.label}: $${item.value}`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex ml-[30px] mt-2 overflow-x-auto">
          {barChartData.map((item: any, idx: number) => (
            <div key={idx} className="flex-1 text-center text-[9px] text-[#A0AEC0] font-medium leading-tight min-w-[20px] truncate" title={item.label}>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Courses Uploaded */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6">
          <h3 className="text-[16px] font-bold text-[#202127] mb-4">Courses Uploaded</h3>
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="pb-3 font-bold text-[#A0AEC0] text-[11px] uppercase tracking-wider">Courses</th>
                <th className="pb-3 font-bold text-[#A0AEC0] text-[11px] uppercase tracking-wider">Tutors</th>
                <th className="pb-3 font-bold text-[#A0AEC0] text-[11px] uppercase tracking-wider text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {coursesUploaded.length > 0 ? coursesUploaded.map((c: any, i: number) => (
                <tr key={i} className="border-b border-[#f0f4f8] last:border-none">
                  <td className="py-3 text-[#202127] font-medium">{c.name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt={c.tutor} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-[#4e515c]">{c.tutor}</span>
                    </div>
                  </td>
                  <td className="py-3 text-[#202127] font-bold text-right">&#8358;{c.price.toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="py-3 text-center text-[#A0AEC0]">No courses found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Courses Sold */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6">
          <h3 className="text-[16px] font-bold text-[#202127] mb-4">Courses Sold</h3>
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="pb-3 font-bold text-[#A0AEC0] text-[11px] uppercase tracking-wider">Courses</th>
                <th className="pb-3 font-bold text-[#A0AEC0] text-[11px] uppercase tracking-wider text-right">Price</th>
                <th className="pb-3 font-bold text-[#A0AEC0] text-[11px] uppercase tracking-wider text-right">Sold</th>
              </tr>
            </thead>
            <tbody>
              {coursesSold.length > 0 ? coursesSold.map((c: any, i: number) => (
                <tr key={i} className="border-b border-[#f0f4f8] last:border-none">
                  <td className="py-3 text-[#202127] font-medium">{c.name}</td>
                  <td className="py-3 text-[#202127] font-bold text-right">&#8358;{c.price.toLocaleString()}</td>
                  <td className="py-3 text-[#4e515c] text-right">{c.sold}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="py-3 text-center text-[#A0AEC0]">No sales yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default FinancePage;
