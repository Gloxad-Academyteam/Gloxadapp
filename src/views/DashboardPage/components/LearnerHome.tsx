"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiChevronRight, FiAward, FiBookOpen } from "react-icons/fi";
import useAuth from "@hooks/useAuth";
import axiosInstance from "../../../utils/axiosInstance";
import { getMyEnrollments } from "@services/enrollments";

// The course's picture, or a plain tinted block when it has none
const Thumb = ({ course, className }: { course: any; className: string }) =>
  course?.thumbnailUrl && /^https?:\/\//.test(course.thumbnailUrl) ? (
    <img src={course.thumbnailUrl} alt="" className={`${className} object-cover`} />
  ) : (
    <div className={`${className} bg-gradient-to-br from-[#dfe7ff] to-[#c3d2ff]`} />
  );

// The learner's home: where they left off, what to take next, and what they have earned. Everything shown is real data.
const LearnerHome = () => {
  const router = useRouter();
  const { authenticatedUser } = useAuth();

  const { data: enrollments = [], isLoading } = useQuery({ queryKey: ["my-courses"], queryFn: getMyEnrollments });
  const { data: catalogue = [] } = useQuery({
    queryKey: ["home.recommended"],
    queryFn: async () => {
      const res = await axiosInstance.get("/courses?limit=12");
      return (res.data?.courses ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : [])) as any[];
    },
  });

  const percentOf = (e: any) => e.progressPercentage ?? 0;
  const withCourse = enrollments.filter((e: any) => e.course);
  const inProgress = withCourse
    .filter((e: any) => percentOf(e) < 100)
    .sort((a: any, b: any) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  const completed = withCourse.filter((e: any) => percentOf(e) >= 100);
  const lessonsDone = withCourse.reduce((total: number, e: any) => total + (e.completedLessons?.length ?? 0), 0);
  const average = withCourse.length ? Math.round(withCourse.reduce((t: number, e: any) => t + percentOf(e), 0) / withCourse.length) : 0;
  const enrolledIds = new Set(withCourse.map((e: any) => String(e.course._id)));
  const recommended = catalogue.filter((c: any) => !enrolledIds.has(String(c._id))).slice(0, 3);
  const firstName = authenticatedUser?.firstName || "there";

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-10">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#2a5bd7] to-[#4a86f0] p-8 text-white md:flex-row md:items-center md:p-10">
        <div>
          <h1 className="text-[28px] font-bold md:text-[34px]">Welcome back, {firstName}!</h1>
          <p className="mt-3 max-w-[520px] text-[14px] leading-[1.7] text-white/90">
            "Education is the most powerful weapon which you can use to change the world."
          </p>
          <Link href="/dashboard?tab=my-courses" className="mt-5 inline-flex h-[36px] items-center rounded-full bg-white/15 px-5 text-[12px] font-semibold text-white ring-1 ring-white/40 hover:bg-white/25">
            My Courses
          </Link>
        </div>
        <div className="flex shrink-0 gap-6 rounded-xl border border-white/30 px-8 py-5 text-center">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/80">Lessons done</p>
            <p className="mt-1 text-[28px] font-bold">{lessonsDone}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/80">Completed</p>
            <p className="mt-1 text-[28px] font-bold">{completed.length}</p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-10">
          {/* Continue learning */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#201633]">Continue Learning</h2>
              <Link href="/dashboard?tab=my-courses" className="text-[12px] font-semibold text-[#07004d] hover:underline">View All Courses</Link>
            </div>
            {isLoading ? (
              <p className="text-[14px] text-[#717480]">Loading your courses...</p>
            ) : inProgress.length === 0 ? (
              <div className="rounded-2xl border border-[#e5e7ef] bg-white p-8 text-center">
                <FiBookOpen className="mx-auto mb-3 text-[28px] text-[#07004d]" />
                <p className="text-[14px] text-[#4e515c]">{withCourse.length === 0 ? "You haven't started a course yet." : "You've finished every course you started."}</p>
                <Link href="/free" className="mt-4 inline-flex h-[40px] items-center rounded-full bg-[#07004d] px-6 text-[13px] font-semibold text-white">Browse free courses</Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {inProgress.slice(0, 2).map((e: any) => (
                  <article key={e._id} className="overflow-hidden rounded-2xl border border-[#e5e7ef] bg-white">
                    <Thumb course={e.course} className="h-[150px] w-full" />
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-[15px] font-bold text-[#201633]">{e.course.title}</h3>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-[#4e515c]">
                        <span>Progress</span>
                        <span className="font-semibold">{percentOf(e)}%</span>
                      </div>
                      <div className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-[#e5e7ef]">
                        <div className="h-full rounded-full bg-[#07004d]" style={{ width: `${percentOf(e)}%` }} />
                      </div>
                      <button type="button" onClick={() => router.push(`/learning/${e.course._id}`)} className="mt-4 h-[38px] w-full rounded-[6px] bg-[#07004d] text-[12px] font-semibold text-white hover:bg-[#111456]">
                        Resume &rarr;
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Recommended */}
          {recommended.length > 0 && (
            <section>
              <h2 className="mb-4 text-[17px] font-bold text-[#201633]">Recommended for You</h2>
              <ul className="divide-y divide-[#eceef5] rounded-2xl border border-[#e5e7ef] bg-white">
                {recommended.map((c: any) => (
                  <li key={c._id}>
                    <Link href={`/courses/${c.slug || c._id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-[#f9fafd]">
                      <Thumb course={c} className="h-[40px] w-[40px] shrink-0 rounded-md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-[#201633]">{c.title}</span>
                        <span className="block truncate text-[12px] text-[#717480]">{c.level ? `${c.level} · ` : ""}Free</span>
                      </span>
                      <FiChevronRight className="shrink-0 text-[#8a8c95]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certificates */}
          {completed.length > 0 && (
            <section>
              <h2 className="mb-4 text-[17px] font-bold text-[#201633]">View Certificates</h2>
              <ul className="divide-y divide-[#eceef5] rounded-2xl border border-[#e5e7ef] bg-white">
                {completed.slice(0, 3).map((e: any) => (
                  <li key={e._id}>
                    <Link href={`/learning/${e.course._id}/certificate`} className="flex items-center gap-4 px-5 py-4 hover:bg-[#f9fafd]">
                      <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#07004d]"><FiAward /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-[#201633]">{e.course.title}</span>
                        <span className="block text-[12px] text-[#717480]">Completed</span>
                      </span>
                      <FiChevronRight className="shrink-0 text-[#8a8c95]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right: overall progress */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#e5e7ef] bg-white p-6 text-center">
            <h3 className="mb-4 text-left text-[15px] font-bold text-[#201633]">Overall Progress</h3>
            <div className="relative mx-auto h-[130px] w-[130px]">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7ef" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#2a5bd7" strokeWidth="9" strokeLinecap="round" strokeDasharray="263.9" strokeDashoffset={263.9 - (263.9 * average) / 100} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-bold">{average}%</span>
                <span className="text-[11px] text-[#717480]">average</span>
              </div>
            </div>
            <dl className="mt-5 space-y-2 text-left text-[12px]">
              <div className="flex justify-between"><dt className="text-[#717480]">Courses enrolled</dt><dd className="font-semibold">{withCourse.length}</dd></div>
              <div className="flex justify-between"><dt className="text-[#717480]">In progress</dt><dd className="font-semibold">{inProgress.length}</dd></div>
              <div className="flex justify-between"><dt className="text-[#717480]">Completed</dt><dd className="font-semibold">{completed.length}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LearnerHome;
