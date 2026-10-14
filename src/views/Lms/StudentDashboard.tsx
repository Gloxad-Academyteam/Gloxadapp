"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  MdOutlineAssignment,
  MdOutlineAssignmentTurnedIn,
  MdOutlineBook,
  MdOutlineFlag,
  MdOutlineFolderOpen,
  MdOutlineForum,
  MdOutlinePlayCircle,
  MdOutlineStarBorder,
  MdOutlineVideoCall,
  MdOutlineVideocam,
  MdOutlineWorkspacePremium,
} from "react-icons/md";
import useAuth from "@hooks/useAuth";
import LmsShell, { soon } from "./components/LmsShell";
import { cardClass } from "./components/ui";
import { ANNOUNCEMENTS, STUDENT_PROGRESS, UPCOMING_ACTIVITIES } from "./data";

const ACTIVITY_STYLE: Record<string, { Icon: IconType; tile: string; icon: string; tag: string }> = {
  reading: { Icon: MdOutlineBook, tile: "bg-[#e7f1f8]", icon: "text-[#0b6f99]", tag: "bg-[#dcebf6] text-[#0b5f8a]" },
  assignment: { Icon: MdOutlineAssignmentTurnedIn, tile: "bg-[#fdebeb]", icon: "text-[#c62828]", tag: "bg-[#fde3e3] text-[#c62828]" },
  live: { Icon: MdOutlineVideocam, tile: "bg-[#e9ecfb]", icon: "text-[#1a1a7a]", tag: "bg-[#e3e7fb] text-[#1a1a7a]" },
  milestone: { Icon: MdOutlineFlag, tile: "bg-[#ecebf7]", icon: "text-[#1a1a7a]", tag: "bg-[#e9e8f5] text-[#1a1a7a]" },
};

const QUICK_ACCESS: { label: string; Icon: IconType; href?: string }[] = [
  { label: "Assignments", Icon: MdOutlineAssignment, href: "/lms/assignments" },
  { label: "Live Classes", Icon: MdOutlineVideoCall, href: "/lms/live" },
  { label: "Discussions", Icon: MdOutlineForum, href: "/lms/community" },
  { label: "Materials", Icon: MdOutlineFolderOpen, href: "/lms/curriculum" },
  { label: "Grades", Icon: MdOutlineStarBorder },
  { label: "Certificates", Icon: MdOutlineWorkspacePremium, href: "/lms/certificates" },
];

const StudentDashboard = () => {
  const { authenticatedUser: user } = useAuth();
  const [weekday, setWeekday] = useState("");

  useEffect(() => setWeekday(new Date().toLocaleDateString("en-US", { weekday: "long" })), []);

  return (
    <LmsShell active="dashboard">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1a1a7a] sm:text-[44px]">
          Welcome back, {user?.firstName || "there"}!
        </h1>
        <p className="mt-2 text-[15px] text-[#4a4d66] sm:text-[17px]">
          Full-Stack Web Development <span className="mx-2 text-[#b9b9d0]">&bull;</span>
          <span className="font-medium text-[#1a1a7a]">Week 2</span> <span className="mx-2 text-[#b9b9d0]">&bull;</span>
          {weekday || " "}
        </p>

        <div className="mt-8 grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col gap-7">
            <section className={`${cardClass} p-6 sm:p-8`}>
              <h2 className="text-[22px] font-bold text-[#14162b]">Progress Overview</h2>
              <div className="mt-6 flex items-center justify-between text-[14px]">
                <span className="text-[#2a2c42]">Overall Program Progress</span>
                <span className="text-[18px] font-medium text-[#1a1a7a]">{STUDENT_PROGRESS.overall}%</span>
              </div>
              <div role="progressbar" aria-label="Overall program progress" aria-valuenow={STUDENT_PROGRESS.overall} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-3 overflow-hidden rounded-full bg-[#e8e7f3]">
                <div className="h-full rounded-full bg-[#6cc1ff]" style={{ width: `${STUDENT_PROGRESS.overall}%` }} />
              </div>
              <div className="mt-7 grid gap-5 sm:grid-cols-3">
                {STUDENT_PROGRESS.breakdown.map(({ label, value, percent }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-[12px] text-[#14162b]">
                      <span>{label}</span>
                      <span className="font-bold">{value}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e8e7f3]">
                      <div className="h-full rounded-full bg-[#020060]" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col justify-between gap-6 rounded-[10px] bg-[#1a1a7a] p-6 text-white shadow-[0_18px_40px_-20px_rgba(26,26,122,0.8)] sm:flex-row sm:items-center sm:p-8">
              <div>
                <h2 className="text-[22px] font-bold leading-snug sm:text-[24px]">Up Next: React State Management</h2>
                <p className="mt-3 max-w-[360px] text-[14px] leading-relaxed text-[#c9cbf5]">Resume your guided journey. Estimated time: 45 mins.</p>
              </div>
              <Link
                href="/lms/curriculum/lesson"
                className="inline-flex w-fit shrink-0 items-center gap-3 rounded-[8px] bg-white px-6 py-4 text-[14px] font-bold text-[#1a1a7a] transition-colors hover:bg-[#eceefd]"
              >
                <MdOutlinePlayCircle size={28} /> Continue
                <br className="hidden sm:block" />
                Learning
              </Link>
            </section>

            <section aria-labelledby="upcoming-title">
              <h2 id="upcoming-title" className="text-[20px] font-bold text-[#14162b]">
                Upcoming Activities
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {UPCOMING_ACTIVITIES.map(({ kind, title, due, href, tone }) => {
                  const { Icon, tile, icon, tag } = ACTIVITY_STYLE[tone];
                  return (
                    <Link key={title} href={href} className="flex items-center gap-4 rounded-[10px] border border-[#dedcec] bg-white p-4 transition-shadow hover:shadow-md">
                      <span className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[8px] ${tile}`}>
                        <Icon size={26} className={icon} />
                      </span>
                      <span className="min-w-0">
                        <span className={`inline-block rounded-[4px] px-2 py-0.5 text-[10px] font-medium ${tag}`}>{kind}</span>
                        <span className="mt-1 block text-[15px] font-medium text-[#14162b]">{title}</span>
                        <span className="mt-0.5 block text-[12px] text-[#4a4d66]">{due}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="grid min-w-0 items-start gap-7 md:grid-cols-2 xl:grid-cols-1">
            <section className={`${cardClass} p-6`}>
              <h2 className="text-[22px] font-bold text-[#14162b]">Quick Access</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {QUICK_ACCESS.map(({ label, Icon, href }) => {
                  const content = (
                    <>
                      <Icon size={26} className="text-[#1a1a7a]" />
                      <span className="mt-2 text-[12px] font-medium text-[#14162b]">{label}</span>
                    </>
                  );
                  const className =
                    "flex h-[100px] flex-col items-center justify-center rounded-[8px] border border-[#dedcec] bg-[#f3f1fb] p-2 text-center transition-colors hover:bg-[#eae8f8]";
                  return href ? (
                    <Link key={label} href={href} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <button key={label} type="button" onClick={() => soon(label)} className={className}>
                      {content}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={`${cardClass} p-6`}>
              <div className="flex items-center justify-between">
                <h2 className="text-[22px] font-bold text-[#14162b]">Announcements</h2>
                <button type="button" onClick={() => soon("Announcements")} className="text-[12px] font-bold text-[#1a1a7a] hover:underline">
                  View All
                </button>
              </div>
              <ul className="mt-5 flex flex-col gap-5">
                {ANNOUNCEMENTS.map(({ time, title, text }) => (
                  <li key={title} className="border-l-[3px] border-[#8ac5f0] pl-4">
                    <p className="text-[11px] font-bold text-[#4a4d66]">{time}</p>
                    <p className="mt-1.5 text-[15px] font-medium text-[#14162b]">{title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#4a4d66]">{text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </LmsShell>
  );
};

export default StudentDashboard;
