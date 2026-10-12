"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineChevronLeft, MdOutlineChevronRight, MdOutlineEdit, MdOutlineFilterList, MdOutlineMoreVert, MdOutlineSearch, MdOutlineVerifiedUser, MdOutlineWorkspacePremium } from "react-icons/md";
import { LuGraduationCap, LuTrendingUp, LuUsers } from "react-icons/lu";
import { PiChartBarFill, PiShieldPlus } from "react-icons/pi";
import CategoryImage from "@components/CategoryImage";
import LmsShell, { soon } from "./components/LmsShell";
import { cardClass } from "./components/ui";
import { ADMIN_STATS, ADMIN_USERS, ENROLLMENT_TRENDS, RECENT_CERTIFICATES, TAdminUser } from "./data";

const PAGE_SIZE = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const WATERMARK = { chart: PiChartBarFill, users: LuUsers, cap: LuGraduationCap, shield: PiShieldPlus } as const;

const AdminDashboard = () => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | TAdminUser["role"]>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, roleFilter]);

  const matches = ADMIN_USERS.filter((user) => (roleFilter === "All" || user.role === roleFilter) && `${user.name} ${user.email}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = matches.length ? (current - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(current * PAGE_SIZE, matches.length);
  const windowStart = Math.min(Math.max(1, current - 1), Math.max(1, pageCount - 2));
  const pages = Array.from({ length: Math.min(3, pageCount) }, (_, i) => windowStart + i);

  return (
    <LmsShell active="dashboard" topTab="certificates" search="Search...">
      <div className="mx-auto max-w-[1280px]">
        <h1 className="text-[30px] font-bold leading-tight text-[#1a1a7a] sm:text-[34px]">Analytics Dashboard</h1>
        <p className="mt-1.5 text-[15px] text-[#2a2c42]">Platform overview and administrative controls.</p>

        <section aria-label="Key figures" className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ADMIN_STATS.map(({ label, value, note, tone, icon }) => {
            const Watermark = WATERMARK[icon];
            return (
              <article key={label} className="relative overflow-hidden rounded-[12px] bg-white p-6 shadow-[0_8px_30px_-18px_rgba(40,40,120,0.2)]">
                <Watermark aria-hidden size={52} className="absolute right-5 top-5 text-[#d8d7e6]" />
                <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#2a2c42]">{label}</p>
                <p className="mt-4 text-[40px] font-bold leading-none tracking-tight text-[#1a1a7a] sm:text-[46px]">{value}</p>
                <p className={`mt-4 flex items-center gap-1.5 text-[13px] font-medium ${tone === "flat" ? "text-[#2a2c42]" : "text-[#4fb0e8]"}`}>
                  {tone === "up" && <LuTrendingUp size={14} />}
                  {tone === "ok" && <MdOutlineVerifiedUser size={15} />}
                  {tone === "flat" && <span aria-hidden>=</span>} {note}
                </p>
              </article>
            );
          })}
        </section>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="trends-title" className="rounded-[12px] bg-white p-6 shadow-[0_8px_30px_-18px_rgba(40,40,120,0.2)] sm:p-8">
            <div className="flex items-center justify-between">
              <h2 id="trends-title" className="text-[22px] font-bold text-[#1a1a7a]">Enrollment Trends</h2>
              <button type="button" aria-label="Chart options" onClick={() => soon("Chart options")} className="rounded-full p-1 text-[#14162b] hover:bg-[#f3f1fb]">
                <MdOutlineMoreVert size={22} />
              </button>
            </div>
            <div className="mt-6 rounded-[4px] border border-[#dedcec] bg-gradient-to-b from-[#f2f1fb] to-[#eceefa] p-5">
              <div role="img" aria-label="Enrollment by month, peaking in May" className="flex h-[230px] items-end gap-3 sm:gap-5">
                {ENROLLMENT_TRENDS.map((value, index) => (
                  <div key={MONTHS[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="w-full" style={{ height: `${value}%`, backgroundColor: index === ENROLLMENT_TRENDS.length - 1 ? "#6a5fa8" : "#5f9fc0" }} />
                    <span className="text-[11px] text-[#4a4d66]">{MONTHS[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="recent-title" className="rounded-[12px] bg-white p-6 shadow-[0_8px_30px_-18px_rgba(40,40,120,0.2)]">
            <div className="flex items-center justify-between">
              <h2 id="recent-title" className="text-[22px] font-bold text-[#1a1a7a]">Recent Certificates</h2>
              <Link href="/lms/certificates" className="text-[12px] font-bold text-[#1a1a7a] hover:underline">View All</Link>
            </div>
            <ul className="mt-5 flex flex-col">
              {RECENT_CERTIFICATES.map(({ title, who, ago }) => (
                <li key={title} className="flex items-start gap-3 border-b border-[#eceaf5] py-4 last:border-b-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#d6ebfa] text-[#1a4a7a]">
                    <MdOutlineWorkspacePremium size={20} />
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-[#14162b]">{title}</p>
                    <p className="text-[12px] font-medium text-[#2a2c42]">Issued to {who}</p>
                    <p className="mt-0.5 text-[12px] text-[#4a4d66]">{ago}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="users-title" className="mt-7 overflow-hidden rounded-[12px] bg-white shadow-[0_8px_30px_-18px_rgba(40,40,120,0.2)]">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
            <h2 id="users-title" className="text-[22px] font-bold text-[#1a1a7a]">User Management</h2>
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search users"
                  placeholder="Search users..."
                  className="h-10 w-[200px] rounded-[4px] border border-[#d6d4e6] bg-white pl-3 pr-9 text-[14px] outline-none placeholder:text-[#8d8fa6] focus:border-[#020060] sm:w-[290px]"
                />
                <MdOutlineSearch size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4d66]" />
              </div>
              <button type="button" aria-expanded={isFilterOpen} onClick={() => setIsFilterOpen((open) => !open)} className="flex h-10 items-center gap-2 rounded-[4px] border border-[#9fc3da] bg-[#e5f1f8] px-4 text-[14px] font-medium text-[#00658f] hover:bg-[#d8eaf4]">
                <MdOutlineFilterList size={16} /> Filter
              </button>
              {isFilterOpen && (
                <div role="group" aria-label="Role filter" className="absolute right-0 top-full z-10 mt-2 flex w-[220px] flex-wrap gap-2 rounded-[8px] border border-[#dedcec] bg-white p-3 shadow-xl">
                  {(["All", "Instructor", "Student"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={roleFilter === option}
                      onClick={() => {
                        setRoleFilter(option);
                        setIsFilterOpen(false);
                      }}
                      className={`rounded-full border px-3 py-1 text-[12px] ${roleFilter === option ? "border-[#020060] bg-[#020060] text-white" : "border-[#d6d4e6] hover:bg-[#f3f1fb]"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-[#f3f2fa]">
                <tr className="border-y border-[#dedcec]">
                  {["User", "Role", "Status", "Last Login", "Actions"].map((heading, i) => (
                    <th key={heading} scope="col" className={`px-6 py-4 text-[12px] font-medium uppercase tracking-[0.1em] text-[#2a2c42] ${i === 0 ? "pl-[14%]" : ""}`}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.email} className="border-b border-[#e8e7f1] last:border-b-0">
                    <td className="px-6 py-4 pl-[14%]">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e0e3fb] text-[12px] font-bold text-[#1a1a7a]">
                          {user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                          {user.image && (
                            <span className="absolute inset-0">
                              <CategoryImage src={user.image} className="h-full w-full object-cover" fallback={null} />
                            </span>
                          )}
                        </span>
                        <div>
                          <p className="text-[15px] font-medium text-[#14162b]">{user.name}</p>
                          <p className="text-[13px] text-[#4a4d66]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[15px] text-[#14162b]">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-[12px] font-medium ${user.status === "Active" ? "bg-[#d6ebfa] text-[#1a4a7a]" : "bg-[#fde3e3] text-[#c62828]"}`}>{user.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-[14px] text-[#14162b]">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <button type="button" aria-label={`Edit ${user.name}`} onClick={() => soon("Editing users")} className="rounded-full p-1.5 text-[#2a2c42] hover:bg-[#f3f1fb]">
                        <MdOutlineEdit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-[#e8e7f1] border-t border-[#dedcec] md:hidden">
            {rows.map((user) => (
              <li key={user.email} className="flex items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-[#14162b]">{user.name}</p>
                  <p className="truncate text-[13px] text-[#4a4d66]">{user.email}</p>
                  <p className="mt-1 text-[12px] text-[#4a4d66]">{user.role} &middot; {user.lastLogin}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${user.status === "Active" ? "bg-[#d6ebfa] text-[#1a4a7a]" : "bg-[#fde3e3] text-[#c62828]"}`}>{user.status}</span>
              </li>
            ))}
          </ul>
          {!rows.length && <p className="border-t border-[#dedcec] p-8 text-center text-[14px] text-[#4a4d66]">No users match your search.</p>}

          <div className="flex flex-col gap-3 border-t border-[#dedcec] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] text-[#2a2c42]" aria-live="polite">
              Showing {from} to {to} of {matches.length} entries
            </p>
            <nav aria-label="Pagination" className="flex items-center gap-1.5">
              <button type="button" aria-label="Previous page" disabled={current <= 1} onClick={() => setPage(current - 1)} className="flex h-8 w-6 items-center justify-center rounded text-[#4a4d66] disabled:opacity-40">
                <MdOutlineChevronLeft size={18} />
              </button>
              {pages.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === current ? "page" : undefined}
                  onClick={() => setPage(n)}
                  className={`h-10 w-10 rounded-[4px] border text-[14px] ${n === current ? "border-[#020060] bg-[#020060] text-white" : "border-[#c9c8dc] bg-white text-[#14162b] hover:bg-[#f3f1fb]"}`}
                >
                  {n}
                </button>
              ))}
              <button type="button" aria-label="Next page" disabled={current >= pageCount} onClick={() => setPage(current + 1)} className="flex h-8 w-6 items-center justify-center rounded text-[#4a4d66] disabled:opacity-40">
                <MdOutlineChevronRight size={18} />
              </button>
            </nav>
          </div>
        </section>
      </div>
    </LmsShell>
  );
};

export default AdminDashboard;
