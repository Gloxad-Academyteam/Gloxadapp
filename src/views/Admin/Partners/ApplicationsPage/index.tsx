"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LuAlertCircle, LuArrowUpDown, LuBarChart3, LuCalendar, LuHistory, LuMap, LuSlidersHorizontal, LuTrendingUp, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import { useApplications } from "../ApplicationsContext";
import { formatCount, formatDate, STATUS_LABELS, TApplication, TApplicationStatus } from "../data";
import { partnerImages } from "../images";
import ReviewDrawer from "../ReviewDrawer";
import StatusBadge from "../StatusBadge";

const PAGE_SIZE = 5;
const cardClass = "rounded-[6px] border border-[#1f2380] bg-white";
const outlineButtonClass =
  "inline-flex items-center gap-2 rounded-[4px] border border-[#1f2380] bg-white px-4 py-2.5 text-[14px] font-medium text-[#14162b] transition-colors hover:bg-[#f2f3ff]";

type TStatusFilter = "all" | TApplicationStatus;
const FILTERS: TStatusFilter[] = ["all", "pending", "under_review", "approved", "rejected"];
const filterLabel = (filter: TStatusFilter) => (filter === "all" ? "All" : STATUS_LABELS[filter]);

// Approximate positions of partner institutions on the Robinson-projection map (percent of width, height)
const PINS = [
  [20, 36], [24, 41], [30, 34], [27, 62], [35, 70], [47, 27], [50, 30], [52, 33], [49, 55], [57, 50],
  [58, 68], [63, 42], [69, 46], [74, 55], [79, 36], [84, 40], [87, 74],
];

const GROWTH = [
  ["May", 47],
  ["Jun", 65],
  ["Jul", 53],
  ["Aug", 82],
  ["Sep", 100],
  ["Oct", 70],
  ["Nov", 88],
] as const;

const ACTIVITY = [
  { title: "New Application", text: "St. Peters College submitted an application.", time: "2 hours ago", dot: "bg-[#030069]" },
  { title: "Application Approved", text: "Lighthouse Academy was approved by Alex.", time: "5 hours ago", dot: "bg-[#2e7d32]" },
  { title: "Under Review", text: "Eastside Vocational moved to internal review.", time: "Yesterday", dot: "bg-[#3b92cc]" },
];

const RecentActivity = () => (
  <section className={`${cardClass} p-6`}>
    <h2 className="flex items-center gap-3 text-[16px] font-bold text-[#14162b]">
      <LuHistory className="shrink-0 text-[#030069]" size={22} /> Recent Activity
    </h2>
    <ul className="mt-5 flex flex-col gap-5">
      {ACTIVITY.map(({ title, text, time, dot }) => (
        <li key={title} className="flex items-start gap-3">
          <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <div>
            <p className="text-[14px] font-medium text-[#14162b]">{title}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-[#3f4257]">{text}</p>
            <p className="mt-1.5 text-[11px] text-[#6a6d83]">{time}</p>
          </div>
        </li>
      ))}
    </ul>
    <button
      type="button"
      onClick={() => toast.info("Full activity history is coming soon.")}
      className="mt-6 w-full rounded-[4px] border border-[#030069] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#030069] transition-colors hover:bg-[#f2f3ff]"
    >
      View all history
    </button>
  </section>
);

const ApplicationsPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { applications, pendingCount } = useApplications();

  const query = params.get("q")?.trim() ?? "";
  const statusParam = params.get("status") as TStatusFilter | null;
  const status: TStatusFilter = statusParam && FILTERS.includes(statusParam) ? statusParam : "all";
  const reviewId = params.get("review");

  const [page, setPage] = useState(1);
  const [newestFirst, setNewestFirst] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const setParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([key, value]) => (value === null ? next.delete(key) : next.set(key, value)));
    const search = next.toString();
    router.replace(`/admin/partners/applications${search ? `?${search}` : ""}`, { scroll: false });
  };

  useEffect(() => setPage(1), [query, status, newestFirst]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return applications
      .filter((item) => status === "all" || item.status === status)
      .filter(
        (item) =>
          !needle ||
          [item.institution, item.email, item.representative.name, item.type].some((value) => value.toLowerCase().includes(needle))
      )
      .sort((a, b) => {
        const diff = a.submittedAt.localeCompare(b.submittedAt) || a.id.localeCompare(b.id);
        return newestFirst ? -diff : diff;
      });
  }, [applications, query, status, newestFirst]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);
  const reviewing: TApplication | undefined = reviewId ? applications.find((item) => item.id === reviewId) : undefined;

  const openReview = (id: string) => setParams({ review: id });
  const closeReview = () => setParams({ review: null });

  return (
    <div className="mx-auto max-w-[1380px]">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-[30px] font-bold leading-tight text-[#030069] sm:text-[38px]">Institution Applications</h1>
          <p className="mt-1.5 text-[15px] text-[#3f4257] sm:text-[17px]">Review and manage incoming partnerships for the Gloxad ecosystem.</p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <button
            type="button"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((open) => !open)}
            className={outlineButtonClass}
          >
            <LuSlidersHorizontal size={16} /> Filters
            {status !== "all" && <span className="rounded-full bg-[#030069] px-2 py-0.5 text-[11px] font-bold text-white">1</span>}
          </button>
          <button type="button" onClick={() => setNewestFirst((value) => !value)} className={outlineButtonClass} aria-label={`Sort by date submitted, ${newestFirst ? "newest" : "oldest"} first`}>
            <LuCalendar size={16} /> Date Submitted <LuArrowUpDown size={14} className="text-[#6a6d83]" />
          </button>

          {isFilterOpen && (
            <div role="group" aria-label="Filter by status" className="absolute right-0 top-full z-20 mt-2 w-[260px] rounded-[6px] border border-[#1f2380] bg-white p-4 shadow-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6a6d83]">Status</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={status === filter}
                    onClick={() => {
                      setParams({ status: filter === "all" ? null : filter });
                      setIsFilterOpen(false);
                    }}
                    className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      status === filter ? "border-[#030069] bg-[#030069] text-white" : "border-[#c9cce8] text-[#2a2c42] hover:bg-[#f2f3ff]"
                    }`}
                  >
                    {filterLabel(filter)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {(query || status !== "all") && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px]">
          <span className="text-[#4a4d66]">Showing results for</span>
          {query && (
            <button type="button" onClick={() => setParams({ q: null })} className="inline-flex items-center gap-1.5 rounded-full bg-[#e8ebfc] px-3 py-1 font-medium text-[#030069]">
              &ldquo;{query}&rdquo; <LuX size={13} />
            </button>
          )}
          {status !== "all" && (
            <button type="button" onClick={() => setParams({ status: null })} className="inline-flex items-center gap-1.5 rounded-full bg-[#e8ebfc] px-3 py-1 font-medium text-[#030069]">
              {filterLabel(status)} <LuX size={13} />
            </button>
          )}
        </div>
      )}

      <div className="mt-8 grid items-start gap-8 min-[1700px]:grid-cols-[minmax(0,1fr)_360px]">
        <aside aria-label="Summary" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 min-[1700px]:order-2 min-[1700px]:grid-cols-1">
          <section className="rounded-[6px] bg-[#030069] p-6 text-white">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#c9c9f0]">Active Institutions</p>
            <p className="font-display mt-4 text-[48px] font-bold leading-none">124</p>
            <p className="mt-4 flex items-center gap-2 text-[13px] text-[#dfe0fb]">
              <LuTrendingUp size={14} /> <span className="font-bold text-white">+4.2%</span> from last month
            </p>
          </section>

          <section className={`${cardClass} p-6`}>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#4a4d66]">Pending Approvals</p>
            <p className="font-display mt-4 text-[44px] font-bold leading-none text-[#030069]">{pendingCount}</p>
            <p className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-[#c62828]">
              <LuAlertCircle size={14} /> Requires immediate review
            </p>
          </section>

          <section className={`${cardClass} p-6 sm:col-span-2 xl:col-span-1 min-[1700px]:col-span-1`}>
            <h2 className="flex items-center gap-3 text-[16px] font-bold leading-snug text-[#14162b]">
              <LuBarChart3 className="shrink-0 text-[#030069]" size={22} /> Approval Success Rate
            </h2>
            <div role="img" aria-label="78 percent approved, 22 percent rejected" className="mt-5 flex h-3 overflow-hidden rounded-full">
              <span className="bg-[#2e7d32]" style={{ width: "78%" }} />
              <span className="bg-[#c62828]" style={{ width: "22%" }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-wide">
              <span className="text-[#2e7d32]">78% Approved</span>
              <span className="text-[#c62828]">22% Rejected</span>
            </div>
          </section>

          <div className="hidden min-[1700px]:block">
            <RecentActivity />
          </div>
        </aside>

        <section aria-label="Applications" className="min-w-0 min-[1700px]:order-1">
          <div className="overflow-hidden rounded-[2px] border-y border-[#1f2380] bg-white sm:border">
            {/* Table from xl up, stacked cards below */}
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-[#efeff3]">
                  <tr className="border-b border-[#1f2380]">
                    {["Institution Name", "Representative", "Type", "Students", "Date", "Status", "Action"].map((heading) => (
                      <th key={heading} scope="col" className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2a2c42]">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-b border-[#1f2380]/60 last:border-b-0">
                      <td className="px-5 py-5">
                        <p className="text-[15px] font-bold text-[#14162b]">{item.institution}</p>
                        <p className="mt-0.5 text-[12px] text-[#4a4d66]">{item.email}</p>
                      </td>
                      <td className="px-5 py-5 text-[14px] text-[#14162b]">{item.representative.name}</td>
                      <td className="px-5 py-5 text-[14px] text-[#14162b]">{item.type}</td>
                      <td className="px-5 py-5 text-[14px] text-[#14162b]">{formatCount(item.students)}</td>
                      <td className="whitespace-nowrap px-5 py-5 text-[14px] text-[#14162b]">{formatDate(item.submittedAt)}</td>
                      <td className="px-5 py-5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() => openReview(item.id)}
                          aria-label={`View details for ${item.institution}`}
                          className="whitespace-nowrap text-[14px] font-bold text-[#030069] hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-[#1f2380]/40 xl:hidden">
              {rows.map((item) => (
                <li key={item.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-[#14162b]">{item.institution}</p>
                      <p className="truncate text-[12px] text-[#4a4d66]">{item.email}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-[#6a6d83]">Representative</dt>
                      <dd className="mt-0.5 text-[#14162b]">{item.representative.name}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-[#6a6d83]">Type</dt>
                      <dd className="mt-0.5 text-[#14162b]">{item.type}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-[#6a6d83]">Students</dt>
                      <dd className="mt-0.5 text-[#14162b]">{formatCount(item.students)}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-[#6a6d83]">Date</dt>
                      <dd className="mt-0.5 text-[#14162b]">{formatDate(item.submittedAt)}</dd>
                    </div>
                  </dl>
                  <button type="button" onClick={() => openReview(item.id)} className="mt-4 text-[14px] font-bold text-[#030069] hover:underline">
                    View Details
                  </button>
                </li>
              ))}
            </ul>

            {!rows.length && (
              <p className="px-6 py-14 text-center text-[14px] text-[#4a4d66]">
                No applications match your search.{" "}
                <button type="button" onClick={() => router.replace("/admin/partners/applications")} className="font-bold text-[#030069] underline">
                  Clear filters
                </button>
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-[#1f2380] bg-[#f1f1f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-[#3f4257]" aria-live="polite">
                {filtered.length ? `Showing ${from === to ? from : `${from}-${to}`} of ${filtered.length} application${filtered.length === 1 ? "" : "s"}` : "No applications"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="rounded-[2px] border border-[#1f2380] bg-white px-4 py-1.5 text-[13px] font-medium text-[#14162b] transition-colors hover:bg-[#f2f3ff] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= pageCount}
                  className="rounded-[2px] border border-[#1f2380] bg-white px-4 py-1.5 text-[13px] font-medium text-[#14162b] transition-colors hover:bg-[#f2f3ff] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 min-[1700px]:hidden">
        <RecentActivity />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="geo-title" className={`${cardClass} p-5 sm:p-6`}>
          <h2 id="geo-title" className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.14em] text-[#14162b]">
            <LuMap size={20} className="text-[#030069]" /> Geographic Distribution
          </h2>
          <div className="relative mx-auto mt-4 aspect-[1280/650] w-full">
            <CategoryImage src={partnerImages.worldMap} className="h-full w-full object-contain opacity-30 grayscale" fallback={null} />
            {PINS.map(([x, y]) => (
              <span key={`${x}-${y}`} aria-hidden className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6a6d83] ring-2 ring-white" style={{ left: `${x}%`, top: `${y}%` }} />
            ))}
          </div>
          <p className="mt-3 text-center text-[14px] text-[#14162b]">High density detected in Northern European and Asian markets.</p>
        </section>

        <section aria-labelledby="growth-title" className={`${cardClass} p-5 sm:p-6`}>
          <h2 id="growth-title" className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.14em] text-[#14162b]">
            <LuBarChart3 size={20} className="text-[#030069]" /> Monthly Growth Trend
          </h2>
          <div className="mt-6 flex h-[190px] items-end gap-3 sm:gap-5" role="img" aria-label="Monthly growth, highest in September">
            {GROWTH.map(([month, value]) => (
              <span key={month} className="flex-1" style={{ height: `${value}%`, backgroundColor: month === "Sep" ? "#030069" : "#3b92cc" }} />
            ))}
          </div>
          <div aria-hidden className="mt-3 flex gap-3 text-[11px] font-bold uppercase text-[#14162b] sm:gap-5">
            {GROWTH.map(([month]) => (
              <span key={month} className="flex-1 text-center">
                {month}
              </span>
            ))}
          </div>
        </section>
      </div>

      {reviewing && <ReviewDrawer key={reviewing.id} application={reviewing} onClose={closeReview} />}
    </div>
  );
};

export default ApplicationsPage;
