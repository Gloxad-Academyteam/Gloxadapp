"use client";

import React from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

export const card = "rounded-2xl border border-[#e8eaf3] bg-white shadow-[0_1px_2px_rgba(18,20,43,0.04)]";
export const naira = (value: number) => `₦${(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
export const compact = (value: number) => (value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`);

export const timeAgo = (iso: string) => {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

export const duration = (seconds: number) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "12 months" },
] as const;

export const RangeSelect = ({ value, onChange }: { value: number; onChange: (days: 7 | 30 | 90 | 365) => void }) => (
  <div role="tablist" aria-label="Time range" className="inline-flex rounded-xl border border-[#e8eaf3] bg-white p-1">
    {RANGES.map((range) => (
      <button
        key={range.days}
        type="button"
        role="tab"
        aria-selected={value === range.days}
        onClick={() => onChange(range.days)}
        className={`h-8 rounded-lg px-3 text-[13px] font-medium transition ${value === range.days ? "bg-[#12142b] text-white" : "text-[#6b7087] hover:text-[#12142b]"}`}
      >
        {range.label}
      </button>
    ))}
  </div>
);

// null means there was nothing in the earlier period to compare with
export const Delta = ({ change }: { change: number | null }) => {
  if (change === null) return <span className="rounded-full bg-[#eef0ff] px-2 py-0.5 text-[11.5px] font-semibold text-[#4a4cd6]">New</span>;
  if (change === 0) return <span className="text-[12px] text-[#8a90a8]">No change</span>;
  const up = change > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${up ? "bg-[#e3f6ec] text-[#13804d]" : "bg-[#fdeaea] text-[#b42323]"}`}>
      {up ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
      {Math.abs(change)}%
    </span>
  );
};

export const KpiCard = ({ label, value, change, hint, icon: Icon, tint }: { label: string; value: string; change?: number | null; hint?: string; icon: React.ElementType; tint: string }) => (
  <div className={`${card} flex flex-col gap-4 p-5`}>
    <div className="flex items-center justify-between">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon size={19} /></span>
      {change !== undefined && <Delta change={change} />}
    </div>
    <div>
      <p className="text-[28px] font-semibold leading-none tracking-tight text-[#12142b]">{value}</p>
      <p className="mt-2 text-[13px] text-[#6b7087]">{label}</p>
      {hint && <p className="mt-0.5 text-[12px] text-[#9aa0b8]">{hint}</p>}
    </div>
  </div>
);

export const Panel = ({ title, subtitle, action, children, className = "" }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <section className={`${card} p-6 ${className}`}>
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[16px] font-semibold tracking-tight text-[#12142b]">{title}</h3>
        {subtitle && <p className="text-[13px] text-[#6b7087]">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export const Empty = ({ text }: { text: string }) => <div className="flex min-h-[120px] items-center justify-center text-center text-[14px] text-[#8a90a8]">{text}</div>;

export const tooltipStyle = {
  contentStyle: { backgroundColor: "#12142b", borderRadius: 10, border: "none", padding: "8px 12px" },
  itemStyle: { color: "#fff", fontSize: 13, fontWeight: 600 },
  labelStyle: { color: "#9ba0c2", fontSize: 12, marginBottom: 2 },
};

export const ErrorBox = ({ onRetry }: { onRetry: () => void }) => (
  <div className={`${card} p-10 text-center`}>
    <p className="text-[16px] font-semibold">These numbers are not available yet</p>
    <p className="mt-1 text-[14px] text-[#6b7087]">The server may be starting up or needs its latest update. Try again in a moment.</p>
    <button type="button" onClick={onRetry} className="mt-5 h-10 rounded-lg bg-[#12142b] px-5 text-[14px] font-semibold text-white">Try again</button>
  </div>
);
