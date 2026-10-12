"use client";

import { useState } from "react";
import Link from "next/link";
import { MdOutlineArrowForward, MdOutlineBarChart, MdOutlineFilterList, MdOutlineMailOutline, MdOutlineMoreHoriz, MdOutlineMoreVert, MdOutlineSearch, MdOutlineTrendingUp, MdOutlineVideoCall } from "react-icons/md";
import CategoryImage from "@components/CategoryImage";
import LmsShell, { soon } from "./components/LmsShell";
import { cardClass } from "./components/ui";
import { COHORT, ROSTER, TRosterStudent } from "./data";

const MODULE_COMPLETION = [96, 90, 82, 68, 40, 12];
const PAGE_STEP = 3;

const STATUS_STYLE: Record<TRosterStudent["status"], string> = {
  Present: "bg-[#dcebf6] text-[#0b5f8a]",
  Absent: "bg-[#fde3e3] text-[#c62828]",
  Excused: "bg-[#e6e6ee] text-[#4a4d66]",
};

const Face = ({ student }: { student: Pick<TRosterStudent, "image" | "initials" | "name"> }) => (
  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e7e8fb] text-[11px] font-bold text-[#1a1a7a]">
    {student.initials ?? student.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
    {student.image && (
      <span className="absolute inset-0">
        <CategoryImage src={student.image} className="h-full w-full object-cover" fallback={null} />
      </span>
    )}
  </span>
);

const InstructorDashboard = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | TRosterStudent["status"]>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [shown, setShown] = useState(PAGE_STEP);

  const matches = ROSTER.filter((student) => (status === "All" || student.status === status) && `${student.name} ${student.email}`.toLowerCase().includes(query.trim().toLowerCase()));
  const rows = matches.slice(0, shown);

  return (
    <LmsShell active="dashboard" topTab="trimesters" search="Search cohort..." bellDot inquiryOnTop>
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1a1a7a] sm:text-[44px]">Cohort Overview</h1>
            <p className="mt-2 text-[15px] text-[#2a2c42] sm:text-[17px]">{COHORT.trimester}</p>
          </div>
          <Link href="/lms/live" className="inline-flex items-center gap-2 rounded-[6px] bg-[#00658f] px-5 py-3 text-[14px] font-medium text-white shadow-[0_12px_24px_-12px_rgba(0,101,143,0.9)] transition-colors hover:bg-[#00577c]">
            <MdOutlineVideoCall size={22} /> Schedule Live Class
          </Link>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-labelledby="analytics-title" className={`${cardClass} p-6`}>
            <div className="flex items-center justify-between">
              <h2 id="analytics-title" className="text-[20px] font-bold text-[#1a1a7a]">Cohort Progress Analytics</h2>
              <button type="button" aria-label="More options" onClick={() => soon("Analytics options")} className="rounded-full p-1.5 text-[#4a4d66] hover:bg-[#f3f1fb]">
                <MdOutlineMoreHoriz size={22} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:px-8">
              <div className="rounded-[6px] border border-[#e1dff0] bg-[#f6f5fb] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#4a4d66]">Avg. Completion</p>
                <p className="mt-2 text-[32px] font-bold leading-none text-[#1a1a7a]">{COHORT.avgCompletion}%</p>
                <div className="mt-3 h-[5px] overflow-hidden rounded-full bg-[#e0deef]">
                  <div className="h-full rounded-full bg-[#00658f]" style={{ width: `${COHORT.avgCompletion}%` }} />
                </div>
              </div>
              <div className="rounded-[6px] border border-[#e1dff0] bg-[#f6f5fb] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#4a4d66]">Active Students</p>
                <p className="mt-2 text-[32px] font-bold leading-none text-[#1a1a7a]">
                  {COHORT.active.now}
                  <span className="text-[18px] font-medium text-[#4a4d66]">/{COHORT.active.total}</span>
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-[#00658f]">
                  <MdOutlineTrendingUp size={16} /> {COHORT.active.delta}
                </p>
              </div>
              <div className="rounded-[6px] border border-[#e1dff0] bg-[#f6f5fb] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#4a4d66]">Avg. Grade</p>
                <p className="mt-2 text-[32px] font-bold leading-none text-[#1a1a7a]">{COHORT.avgGrade}</p>
                <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#4a4d66]">
                  <MdOutlineArrowForward size={14} /> Stable
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[6px] border border-dashed border-[#cfcde2] bg-[#fbfbff] p-5">
              <p className="flex items-center justify-center gap-2 text-[14px] font-medium text-[#2a2c42]">
                <MdOutlineBarChart size={20} /> Module Completion Trend
              </p>
              <div role="img" aria-label="Completion by module, falling from 96 percent in Module 1 to 12 percent in Module 6" className="mt-5 flex h-[130px] items-end gap-3 sm:gap-5">
                {MODULE_COMPLETION.map((value, index) => (
                  <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="w-full rounded-t-[4px] bg-[#6cc1ff]" style={{ height: `${value}%` }} />
                    <span className="text-[11px] text-[#4a4d66]">M{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="grading-title" className={`${cardClass} p-6`}>
            <div className="flex items-center justify-between">
              <h2 id="grading-title" className="text-[20px] font-bold text-[#1a1a7a]">Grading Queue</h2>
              <span className="rounded-full bg-[#fde3e3] px-3 py-1 text-[11px] font-medium text-[#c62828]">{COHORT.gradingPending} Pending</span>
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              {COHORT.grading.map((item, index) => (
                <li key={index} className="rounded-[6px] border border-[#dedcec] bg-white p-4">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className={`rounded-[3px] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${"overdue" in item && item.overdue ? "bg-[#e6e6ee] text-[#4a4d66]" : "bg-[#dcebf6] text-[#0b5f8a]"}`}>{item.module}</span>
                    <span className={"overdue" in item && item.overdue ? "font-medium text-[#c62828]" : "text-[#4a4d66]"}>{item.ago}</span>
                  </div>
                  <p className="mt-2.5 text-[15px] font-medium text-[#14162b]">{item.title}</p>
                  <p className="mt-2 flex items-center gap-2 text-[13px] text-[#2a2c42]">
                    <Face student={{ name: item.student, image: "image" in item ? item.image : undefined, initials: "initials" in item ? item.initials : undefined }} /> {item.student}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/lms/assignments" className="mt-4 flex w-full items-center justify-center rounded-[6px] border border-[#2a2c42] bg-white px-4 py-3 text-[14px] font-medium text-[#14162b] transition-colors hover:bg-[#f3f1fb]">
              View All Assignments
            </Link>
          </section>
        </div>

        <section aria-labelledby="roster-title" className={`${cardClass} mt-6 overflow-hidden`}>
          <div className="flex flex-wrap items-start justify-between gap-4 p-6">
            <div>
              <h2 id="roster-title" className="text-[20px] font-bold text-[#1a1a7a]">Student Roster &amp; Attendance</h2>
              <p className="mt-1 text-[13px] text-[#4a4d66]">{COHORT.liveClass}</p>
            </div>
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <MdOutlineSearch size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8d8fa6]" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setShown(PAGE_STEP);
                  }}
                  aria-label="Find student"
                  placeholder="Find student..."
                  className="h-10 w-[200px] rounded-[6px] border border-[#d6d4e6] bg-white pl-10 pr-3 text-[13px] outline-none placeholder:text-[#8d8fa6] focus:border-[#020060] sm:w-[300px]"
                />
              </div>
              <button type="button" aria-label="Filter by status" aria-expanded={isFilterOpen} onClick={() => setIsFilterOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#d6d4e6] bg-white hover:bg-[#f3f1fb]">
                <MdOutlineFilterList size={20} />
              </button>
              {isFilterOpen && (
                <div role="group" aria-label="Status filter" className="absolute right-0 top-full z-10 mt-2 flex w-[200px] flex-wrap gap-2 rounded-[8px] border border-[#dedcec] bg-white p-3 shadow-xl">
                  {(["All", "Present", "Absent", "Excused"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={status === option}
                      onClick={() => {
                        setStatus(option);
                        setShown(PAGE_STEP);
                        setIsFilterOpen(false);
                      }}
                      className={`rounded-full border px-3 py-1 text-[12px] ${status === option ? "border-[#020060] bg-[#020060] text-white" : "border-[#d6d4e6] hover:bg-[#f3f1fb]"}`}
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
              <thead className="bg-[#f0eff7]">
                <tr className="border-y border-[#dedcec]">
                  {["Student Name", "Status", "Progress", "Last Active", "Actions"].map((heading, i) => (
                    <th key={heading} scope="col" className={`px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#2a2c42] ${i === 0 ? "pl-[12%]" : ""}`}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((student) => (
                  <tr key={student.email} className="border-b border-[#e8e7f1]">
                    <td className="px-6 py-4 pl-[12%]">
                      <div className="flex items-center gap-3">
                        <Face student={student} />
                        <div>
                          <p className="text-[14px] font-medium text-[#14162b]">{student.name}</p>
                          <p className="text-[12px] text-[#4a4d66]">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${STATUS_STYLE[student.status]}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" /> {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-[5px] w-[110px] overflow-hidden rounded-full bg-[#e8e7f1]">
                          <span className={`block h-full rounded-full ${student.progress < 50 ? "bg-[#c62828]" : "bg-[#00658f]"}`} style={{ width: `${student.progress}%` }} />
                        </span>
                        <span className="text-[12px] text-[#4a4d66]">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-[14px] text-[#14162b]">{student.lastActive}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-[#2a2c42]">
                        <button type="button" aria-label={`Email ${student.name}`} onClick={() => soon("Messaging")} className="rounded-full p-1 hover:bg-[#f3f1fb]"><MdOutlineMailOutline size={20} /></button>
                        <button type="button" aria-label={`More actions for ${student.name}`} onClick={() => soon("Student actions")} className="rounded-full p-1 hover:bg-[#f3f1fb]"><MdOutlineMoreVert size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-[#e8e7f1] border-t border-[#dedcec] md:hidden">
            {rows.map((student) => (
              <li key={student.email} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Face student={student} />
                    <div>
                      <p className="text-[14px] font-medium text-[#14162b]">{student.name}</p>
                      <p className="text-[12px] text-[#4a4d66]">{student.email}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${STATUS_STYLE[student.status]}`}>{student.status}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[12px] text-[#4a4d66]">
                  <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#e8e7f1]">
                    <span className={`block h-full rounded-full ${student.progress < 50 ? "bg-[#c62828]" : "bg-[#00658f]"}`} style={{ width: `${student.progress}%` }} />
                  </span>
                  {student.progress}% &middot; {student.lastActive}
                </div>
              </li>
            ))}
          </ul>

          {!rows.length && <p className="border-t border-[#dedcec] p-8 text-center text-[14px] text-[#4a4d66]">No students match your search.</p>}

          {shown < matches.length && (
            <div className="border-t border-[#dedcec] py-4 text-center">
              <button type="button" onClick={() => setShown((value) => value + PAGE_STEP)} className="text-[13px] font-bold text-[#1a1a7a] hover:underline">
                Load More Students &#8964;
              </button>
            </div>
          )}
        </section>
      </div>
    </LmsShell>
  );
};

export default InstructorDashboard;
