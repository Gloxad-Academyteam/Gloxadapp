"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiChevronLeft, FiChevronRight, FiCreditCard, FiPercent, FiSend, FiCheckCircle } from "react-icons/fi";
import axiosInstance from "@utils/axiosInstance";
import { Skeleton } from "../../../components/Skeleton";
import { compact, Empty, ErrorBox, KpiCard, naira, Panel, tooltipStyle } from "../shared";

type TFinance = {
  grossRevenue: number;
  platformCommission: number;
  instructorPayoutsTotal: number;
  totalSuccessfulTransactions: number;
  monthlyBreakdown: { month: string; revenue: number; transactions: number }[];
};

type TTransaction = {
  _id: string;
  reference: string;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: string;
  user?: { firstName?: string; lastName?: string; email?: string };
  course?: { title?: string };
};

const PAGE_SIZE = 8;
const statusStyle = { success: "bg-[#e3f6ec] text-[#13804d]", pending: "bg-[#fff4dc] text-[#a86a00]", failed: "bg-[#fdeaea] text-[#b42323]" };
const monthLabel = (key: string) => {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString(undefined, { month: "short", year: "numeric" });
};

const FinancePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const finance = useQuery({ queryKey: ["admin.finance"], queryFn: async () => (await axiosInstance.get("/admin/finance")).data.finance as TFinance });
  const transactions = useQuery({
    queryKey: ["admin.transactions", page],
    queryFn: async () => (await axiosInstance.get("/admin/recent-transactions", { params: { page, limit: PAGE_SIZE } })).data as { transactions: TTransaction[]; total?: number; totalPages?: number },
    placeholderData: (previous) => previous,
  });

  const header = (
    <div className="mb-6">
      <h2 className="text-[24px] font-semibold tracking-tight text-[#12142b]">Finance</h2>
      <p className="text-[14px] text-[#6b7087]">Money in and out, straight from your payment records.</p>
    </div>
  );

  if (finance.isLoading) {
    return <div className="mx-auto w-full max-w-[1400px]">{header}<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-2xl" />)}</div></div>;
  }
  if (finance.isError || !finance.data) {
    return <div className="mx-auto w-full max-w-[1400px]">{header}<ErrorBox onRetry={() => finance.refetch()} /></div>;
  }

  const data = finance.data;
  const chart = [...data.monthlyBreakdown].reverse().map((row) => ({ ...row, label: monthLabel(row.month) }));
  const rows = transactions.data?.transactions ?? [];
  const totalPages = transactions.data?.totalPages ?? 1;

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10">
      {header}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Gross revenue" value={naira(data.grossRevenue)} icon={FiCreditCard} tint="bg-[#efe9ff] text-[#6a3fd0]" />
        <KpiCard label="Platform share" value={naira(data.platformCommission)} icon={FiPercent} tint="bg-[#e9eaff] text-[#4a4cd6]" />
        <KpiCard label="Paid to tutors" value={naira(data.instructorPayoutsTotal)} icon={FiSend} tint="bg-[#fff1df] text-[#b8650b]" />
        <KpiCard label="Successful payments" value={`${data.totalSuccessfulTransactions}`} icon={FiCheckCircle} tint="bg-[#e3f6ec] text-[#13804d]" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-1" title="Revenue by month" subtitle="Successful payments">
          <div className="h-[280px]">
            {chart.length === 0 ? <Empty text="No payments yet." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a90a8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a90a8" }} tickFormatter={(v) => compact(Number(v))} />
                  <Tooltip {...tooltipStyle} cursor={{ fill: "#f3f4fb" }} formatter={(value: any) => [naira(Number(value)), "Revenue"]} />
                  <Bar dataKey="revenue" fill="#5d5fef" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="Recent payments" subtitle="Newest first" action={
          <div className="flex items-center gap-1 text-[13px] text-[#6b7087]">
            <span className="mr-2">{page} / {totalPages}</span>
            <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronLeft /></button>
            <button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8eaf3] hover:bg-[#f6f7fb] disabled:opacity-40"><FiChevronRight /></button>
          </div>
        }>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#eef0f6] text-[12px] uppercase tracking-wide text-[#8a90a8]">
                  <th className="py-3 pr-4 font-medium">Learner</th>
                  <th className="py-3 pr-4 font-medium">Course</th>
                  <th className="py-3 pr-4 font-medium">Amount</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-[#8a90a8]">No payments yet.</td></tr>
                ) : rows.map((row) => (
                  <tr key={row._id} className="border-b border-[#f3f4f9] last:border-none">
                    <td className="py-3 pr-4"><p className="font-medium">{[row.user?.firstName, row.user?.lastName].filter(Boolean).join(" ") || "Unknown"}</p><p className="text-[12.5px] text-[#8a90a8]">{row.user?.email}</p></td>
                    <td className="py-3 pr-4 text-[#4a4f6b]">{row.course?.title || "-"}</td>
                    <td className="py-3 pr-4 font-medium">{naira(row.amount)}</td>
                    <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${statusStyle[row.status]}`}>{row.status}</span></td>
                    <td className="py-3 text-right text-[#6b7087]">{new Date(row.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default FinancePage;
