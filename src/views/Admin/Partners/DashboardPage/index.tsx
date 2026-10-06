"use client";

import { useState } from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import { LuArrowUp, LuBadgeCheck, LuBanknote, LuBarChart3, LuGraduationCap, LuMessageCircle, LuTrendingUp, LuUserPlus, LuUsers } from "react-icons/lu";
import { PiGavel } from "react-icons/pi";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import { partnerImages } from "../images";
import { useApplications } from "../ApplicationsContext";

const cardClass = "rounded-[6px] border border-[#1f2380] bg-white";

const STATS: { label: string; value: string; note?: string; Icon: IconType; noteIcon?: IconType }[] = [
  { label: "Total Institutions", value: "1,240", note: "+12% vs last month", Icon: LuGraduationCap, noteIcon: LuTrendingUp },
  { label: "Active Students", value: "45,280", note: "4.2k new enrollments", Icon: LuUsers, noteIcon: LuTrendingUp },
  { label: "Monthly Revenue", value: "$284.5k", Icon: LuBanknote },
  { label: "Growth Rate", value: "18.4%", note: "Above quarterly target", Icon: LuBarChart3, noteIcon: LuArrowUp },
];

const RANGES = {
  "30": {
    label: "Last 30 days performance metrics",
    bars: [42, 58, 70, 46, 38, 62, 74, 88, 50, 72, 66, 80, 40, 60, 74],
    ticks: ["Oct 01", "Oct 10", "Oct 20", "Oct 30"],
  },
  "90": {
    label: "Last 90 days performance metrics",
    bars: [30, 36, 44, 40, 52, 48, 60, 56, 66, 62, 72, 68, 78, 84, 90],
    ticks: ["Aug 01", "Sep 01", "Oct 01", "Oct 30"],
  },
} as const;

const ACTIVITY: { title: string; detail: string; meta: string; Icon: IconType; tone: string }[] = [
  { title: "Sarah Miller approved 'Summit Institute'", detail: "Institutional application reviewed and validated.", meta: "14 mins ago", Icon: LuBadgeCheck, tone: "bg-[#e1effc] text-[#3b8fd0]" },
  { title: "James Chen flagged 'EduGlobal'", detail: "Missing documentation for tertiary accreditation.", meta: "1 hour ago", Icon: LuMessageCircle, tone: "bg-[#fff4d6] text-[#e69b00]" },
  { title: "System added 12 new applicants", detail: "Batch import from Global Education Portal completed.", meta: "3 hours ago", Icon: LuUserPlus, tone: "bg-[#efe7fb] text-[#6d3fc4]" },
  { title: "Legal review required", detail: "Partner 'Horizon Labs' terms of service updated.", meta: "Yesterday", Icon: PiGavel, tone: "bg-[#fde8ec] text-[#d6334f]" },
];

const shadeFor = (value: number) => (value < 45 ? "#f2f6fb" : value < 62 ? "#e5eef8" : value < 78 ? "#d6e6f5" : "#c8dff2");

const PartnersDashboardPage = () => {
  const [range, setRange] = useState<keyof typeof RANGES>("30");
  const { pendingCount } = useApplications();
  const current = RANGES[range];

  const tiles = [
    { title: "Review New Submissions", text: `${pendingCount} pending institutional files require your attention.`, image: partnerImages.submissions, href: "/admin/partners/applications?status=pending" },
    { title: "Audit Financial Growth", text: "Analyze revenue distribution across partnered academies.", image: partnerImages.finance },
    { title: "Manage Staff Access", text: "Configure permissions for regional academy managers.", image: partnerImages.staff },
  ];

  return (
    <div className="mx-auto max-w-[1180px]">
      <section aria-label="Key figures" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, note, Icon, noteIcon: NoteIcon }) => (
          <article key={label} className={`${cardClass} flex min-h-[142px] flex-col justify-between p-5`}>
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#030069] text-white">
                <Icon size={21} />
              </span>
              <span className="font-display text-[28px] font-medium leading-none text-[#14162b] sm:text-[30px]">{value}</span>
            </div>
            <div>
              <p className="text-[15px] text-[#3f4257]">{label}</p>
              {note && (
                <p className="mt-2 flex items-center gap-1.5 text-[12px] font-bold text-[#1e8e4b]">
                  {NoteIcon && <NoteIcon size={13} />} {note}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="chart-title" className={`${cardClass} p-6 sm:p-8`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="chart-title" className="text-[20px] font-medium text-[#14162b]">
                New Institutional Applications
              </h2>
              <p className="mt-1 text-[14px] text-[#3f4257]">{current.label}</p>
            </div>
            <div role="group" aria-label="Date range" className="flex items-center gap-1 text-[13px] font-bold">
              {(["30", "90"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={range === key}
                  onClick={() => setRange(key)}
                  className={`rounded-full px-4 py-2 transition-colors ${
                    range === key ? "bg-[#3b8fd0] text-white" : "text-[#2a2c42] hover:bg-[#eef3fa]"
                  }`}
                >
                  {key} Days
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-8 h-[260px] border-b border-l border-[#030069] sm:h-[300px]">
            <LuTrendingUp aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#d7d9de]" size={120} strokeWidth={4} />
            <div role="img" aria-label={`Applications per period, ${current.label.toLowerCase()}`} className="absolute inset-x-0 bottom-0 flex h-full items-end gap-1.5 px-2 sm:gap-3 sm:px-3">
              {current.bars.map((value, index) => {
                const isLast = index === current.bars.length - 1;
                return (
                  <span
                    key={`${range}-${index}`}
                    className="relative z-10 flex-1 transition-[height] duration-300"
                    style={{
                      height: `${value}%`,
                      backgroundColor: isLast ? "#c1d9f0" : shadeFor(value),
                      borderTop: isLast ? "2px solid #3b8fd0" : undefined,
                      opacity: 0.92,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div aria-hidden className="mt-3 flex justify-between text-[13px] text-[#3f4257]">
            {current.ticks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
        </section>

        <section aria-labelledby="activity-title" className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between">
            <h2 id="activity-title" className="text-[20px] font-medium text-[#14162b]">
              Recent Activity
            </h2>
            <Link href="/admin/partners/applications" className="text-[13px] font-bold text-[#0b57d0] hover:underline">
              View All
            </Link>
          </div>
          <ul className="mt-6 flex flex-col gap-6">
            {ACTIVITY.map(({ title, detail, meta, Icon, tone }) => (
              <li key={title} className="flex items-start gap-4">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] ${tone}`}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium leading-snug text-[#14162b]">{title}</p>
                  <p className="mt-1 text-[12px] leading-snug text-[#4a4d66]">{detail}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-[#6a6d83]">{meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-label="Shortcuts" className="mt-8 grid gap-5 md:grid-cols-3">
        {tiles.map(({ title, text, image, href }) => {
          const content = (
            <>
              <CategoryImage src={image} className="absolute inset-0 h-full w-full object-cover" fallback={null} />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1b1a7a] via-[#2a29a0]/60 to-[#4a47c9]/25" />
              <span className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
                <span className="block text-[18px] font-medium">{title}</span>
                <span className="mt-1 block text-[13px] leading-snug text-white/85">{text}</span>
              </span>
            </>
          );
          const className =
            "relative block h-[160px] overflow-hidden rounded-[6px] border border-[#1f2380] bg-[#2a2894] transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#030069]";
          return href ? (
            <Link key={title} href={href} className={className}>
              {content}
            </Link>
          ) : (
            <button key={title} type="button" onClick={() => toast.info(`${title} is coming soon.`)} className={`${className} w-full`}>
              {content}
            </button>
          );
        })}
      </section>
    </div>
  );
};

export default PartnersDashboardPage;
