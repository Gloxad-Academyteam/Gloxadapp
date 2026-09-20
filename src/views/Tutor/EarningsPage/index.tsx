"use client";

import React from "react";
import { 
  FaWallet, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaChartLine,
  FaUniversity,
  FaFileInvoiceDollar,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";

const fetchEarnings = async () => {
  const { data } = await axiosInstance.get("/tutor/earnings");
  return data;
};

import { DashboardMetricCardSkeleton, TableSkeleton, Skeleton } from "../../../components/Skeleton";

export default function EarningsPage() {
  const { data: earningsData, isLoading } = useQuery({
    queryKey: ["tutor.earnings"],
    queryFn: fetchEarnings
  });

  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#fcfcfd] p-6 lg:p-10 space-y-8">
        <div>
          <Skeleton className="h-8 w-44 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
          <DashboardMetricCardSkeleton />
        </div>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  const {
    totalBalance = 0,
    availableForWithdrawal = 0,
    earningsThisMonth = 0,
    lifetimeEarnings = 0,
    trends = { monthly: "0.0", balance: "0.0" },
    revenueAnalytics = [],
    recentTransactions = []
  } = earningsData || {};

  // Find max revenue for scaling chart bars
  const maxRevenue = Math.max(...revenueAnalytics.map((r: any) => r.revenue), 1);

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] p-6 lg:p-10 text-[#202127]">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#07006f] mb-1">Earnings Dashboard</h1>
          <p className="text-[14px] text-[#717480]">Monitor your professional revenue and manage payouts.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-[42px] px-6 bg-[#07006f] text-white rounded-[8px] font-medium text-[14px] hover:bg-[#0a0050] transition-colors">
            Request Withdrawal
          </button>
          <button className="flex-1 md:flex-none h-[42px] px-6 bg-white border border-[#dedee7] text-[#202127] rounded-[8px] font-medium text-[14px] hover:bg-gray-50 transition-colors">
            Payment Settings
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Balance */}
        <div className="bg-white border border-[#dedee7] rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-[40px] h-[40px] rounded-[8px] bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center text-[18px]">
              <FaWallet />
            </div>
            {Number(trends.balance) > 0 ? (
              <span className="text-[12px] font-bold text-[#10b981] bg-[#d1fae5] px-2 py-0.5 rounded-[4px]">+{trends.balance}% ↗</span>
            ) : (
              <span className="text-[12px] font-bold text-[#717480] bg-[#f8fafc] px-2 py-0.5 rounded-[4px]">{trends.balance}%</span>
            )}
          </div>
          <div>
            <p className="text-[13px] text-[#717480] font-medium mb-1">Total Balance</p>
            <h3 className="text-[24px] font-bold text-[#07006f]">${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

        {/* Available for Withdrawal */}
        <div className="bg-white border border-[#dedee7] rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-[40px] h-[40px] rounded-[8px] bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center text-[18px]">
              <FaMoneyBillWave />
            </div>
          </div>
          <div>
            <p className="text-[13px] text-[#717480] font-medium mb-1">Available for Withdrawal</p>
            <h3 className="text-[24px] font-bold text-[#07006f]">${availableForWithdrawal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

        {/* Earnings This Month */}
        <div className="bg-white border border-[#dedee7] rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-[40px] h-[40px] rounded-[8px] bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center text-[18px]">
              <FaCalendarAlt />
            </div>
            {Number(trends.monthly) > 0 ? (
              <span className="text-[12px] font-bold text-[#10b981] bg-[#d1fae5] px-2 py-0.5 rounded-[4px]">+{trends.monthly}% ↗</span>
            ) : (
              <span className="text-[12px] font-bold text-[#717480] bg-[#f8fafc] px-2 py-0.5 rounded-[4px]">{trends.monthly}%</span>
            )}
          </div>
          <div>
            <p className="text-[13px] text-[#717480] font-medium mb-1">Earnings This Month</p>
            <h3 className="text-[24px] font-bold text-[#07006f]">${earningsThisMonth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-white border border-[#dedee7] rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-[40px] h-[40px] rounded-[8px] bg-[#f3f4f6] text-[#6b7280] flex items-center justify-center text-[18px]">
              <FaChartLine />
            </div>
          </div>
          <div>
            <p className="text-[13px] text-[#717480] font-medium mb-1">Lifetime Earnings</p>
            <h3 className="text-[24px] font-bold text-[#07006f]">${lifetimeEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

      </div>

      {/* Middle Section: Chart & Payout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Analytics (takes up 2 columns on lg) */}
        <div className="lg:col-span-2 bg-white border border-[#dedee7] rounded-[16px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[16px] font-bold text-[#202127]">Revenue Analytics</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-[#4e515c] bg-[#f8fafc] border border-[#dedee7] rounded-[6px]">
              Last 6 Months <FaChevronDown className="text-[10px]" />
            </button>
          </div>
          
          {/* Dynamic Bar Chart */}
          <div className="h-[200px] flex items-end justify-between gap-2 px-2 overflow-x-auto">
            {revenueAnalytics.slice(-6).map((data: any, idx: number) => {
              const heightPct = data.revenue > 0 ? Math.max((data.revenue / maxRevenue) * 100, 5) : 5;
              const isCurrentMonth = idx === 5; // since we slice last 6, the 6th is current
              return (
                <div key={data.month} className="w-full flex flex-col items-center gap-3 min-w-[40px]">
                  <div className={`w-full ${isCurrentMonth ? 'bg-[#07006f]' : 'bg-[#cbd5e1]'} rounded-t-[4px] transition-all`} style={{ height: `${heightPct}%` }}></div>
                  <span className="text-[11px] text-[#a0aab8]">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Payout Card */}
        <div className="bg-[#2952a3] rounded-[16px] p-8 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
          {/* subtle background styling */}
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
          
          <div>
            <h3 className="text-[16px] font-bold mb-6">Next Payout</h3>
            <p className="text-[13px] text-blue-200 mb-1">Scheduled for</p>
            <h2 className="text-[24px] font-bold mb-8">July 15, 2024</h2>
            
            <div className="bg-[#3b66b8] rounded-[8px] p-4 flex flex-col gap-2 mb-6">
              <div className="flex justify-between items-center text-[12px] text-blue-200">
                <span>Verified Method</span>
                <FaCheckCircle className="text-white" />
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold">
                <FaUniversity />
                <span>Wells Fargo ****4291</span>
              </div>
            </div>
          </div>

          <button className="w-full h-[46px] bg-white text-[#07006f] rounded-[8px] font-bold text-[14px] hover:bg-gray-100 transition-colors">
            Manage Methods
          </button>
        </div>

      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white border border-[#dedee7] rounded-[16px] shadow-sm overflow-hidden flex flex-col flex-1">
        
        {/* Table Header Controls */}
        <div className="p-6 border-b border-[#dedee7] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-[16px] font-bold text-[#202127]">Recent Transactions</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-[240px]">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aab8]" />
              <input 
                type="text" 
                placeholder="Search course..." 
                className="w-full h-[38px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] pl-9 pr-3 text-[13px] outline-none focus:border-[#cbd5e1] transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-3 h-[38px] text-[13px] font-medium text-[#4e515c] bg-[#f8fafc] border border-[#dedee7] rounded-[6px]">
              All Statuses <FaChevronDown className="text-[10px]" />
            </button>
            <button className="flex items-center gap-2 px-3 h-[38px] text-[13px] font-medium text-[#4e515c] bg-[#f8fafc] border border-[#dedee7] rounded-[6px]">
              <FaFilter className="text-[12px]" /> Filter
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#dedee7]">
                <th className="py-4 px-6 text-[12px] font-bold text-[#717480] uppercase tracking-wider">Course Name</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#717480] uppercase tracking-wider">Student Name</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#717480] uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#717480] uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#717480] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#717480] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-[#dedee7] hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-[13px] font-medium text-[#202127] whitespace-nowrap">{tx.course}</td>
                    <td className="py-4 px-6 text-[13px] text-[#4e515c] whitespace-nowrap">{tx.student}</td>
                    <td className="py-4 px-6 text-[13px] text-[#4e515c] whitespace-nowrap">{tx.date}</td>
                    <td className="py-4 px-6 text-[13px] font-bold text-[#07006f] whitespace-nowrap">{tx.amount}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        tx.status === 'Processed' ? 'bg-[#d1fae5] text-[#10b981]' : 'bg-[#fef3c7] text-[#f59e0b]'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#717480]">
                      <button className="hover:text-[#07006f] transition-colors" title="Download Receipt">
                        <FaFileInvoiceDollar className="text-[16px]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#717480] text-[13px]">
                    No recent transactions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#dedee7] flex justify-between items-center bg-[#f8fafc]">
          <span className="text-[13px] text-[#717480]">Showing 1-4 of 128 transactions</span>
          <div className="flex items-center gap-1">
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#dedee7] bg-white text-[#a0aab8] hover:bg-gray-50">
              <FaChevronLeft className="text-[10px]" />
            </button>
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] bg-[#07006f] text-white font-medium text-[13px]">
              1
            </button>
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#dedee7] bg-white text-[#4e515c] font-medium text-[13px] hover:bg-gray-50">
              2
            </button>
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#dedee7] bg-white text-[#4e515c] font-medium text-[13px] hover:bg-gray-50">
              3
            </button>
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#dedee7] bg-white text-[#4e515c] hover:bg-gray-50">
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
