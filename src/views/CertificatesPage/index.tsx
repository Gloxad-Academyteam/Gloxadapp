"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import useAuth from "@hooks/useAuth";

// A small version of the certificate, in the same blue and gold as the full one
const CertificateThumb = ({ name, course, date, score }: { name: string; course: string; date: string; score?: number }) => (
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-white ring-1 ring-[#c9cff0]">
    <div className="absolute -left-6 top-3 h-3 w-24 -rotate-45 bg-[#1d2fb5]" />
    <div className="absolute -right-8 bottom-6 h-3 w-28 -rotate-45 bg-[#1d2fb5]" />
    <div className="absolute bottom-0 left-0 h-[34%] w-[2px] bg-[#f5b400]" />
    <div className="absolute inset-x-[8%] inset-y-[8%] flex flex-col items-center justify-center bg-[#f7f7fc] px-3 text-center">
      <p className="text-[18px] font-extrabold tracking-wide text-[#0b1a6b] sm:text-[22px]">CERTIFICATE</p>
      <p className="mt-0.5 bg-[#f5b400] px-2 text-[7px] font-semibold uppercase tracking-wider text-[#0b1a6b]">of completion</p>
      <p className="mt-2 font-serif text-[16px] italic text-[#0b1a6b] sm:text-[20px]">{name}</p>
      <p className="mt-1 text-[7px] leading-snug text-[#4e515c] sm:text-[8px]">
        has completed the <b>{course}</b> course on {date}
        {typeof score === "number" ? ` with a score of ${score}%` : ""}.
      </p>
    </div>
  </div>
);

export default function CertificatesPage() {
  const router = useRouter();
  const { authenticatedUser } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["certificates.enrollments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/enrollments/my-courses");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-8 text-[#717480]">Loading certificates...</div>;

  // The API may return a list or an object wrapping one; anything else shows the empty state instead of crashing
  const enrollmentList: any[] = Array.isArray(enrollments)
    ? enrollments
    : Array.isArray(enrollments?.enrollments)
      ? enrollments.enrollments
      : Array.isArray(enrollments?.data)
        ? enrollments.data
        : [];
  const completedCourses = enrollmentList.filter((e: any) => (e.progressPercentage ?? e.progress?.percent) === 100);
  const learnerName = [authenticatedUser?.firstName, authenticatedUser?.lastName].filter(Boolean).join(" ") || "Learner";

  if (completedCourses.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="mb-2 text-[18px] font-bold text-[#202127]">No certificates yet</h2>
        <p className="text-[14px] text-[#717480]">Complete a course 100% to earn your first certificate.</p>
        <button
          onClick={() => router.push("/dashboard/courses")}
          className="mt-6 h-[44px] rounded-full bg-[#07004d] px-8 text-[13px] font-semibold text-white hover:bg-[#111456]"
        >
          Go to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
      {completedCourses.map((enrollment: any) => (
        <div key={enrollment._id}>
          <CertificateThumb
            name={learnerName}
            course={enrollment.course?.title || "Course"}
            date={new Date(enrollment.completedAt || enrollment.updatedAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          />
          <button
            onClick={() => router.push(`/learning/${enrollment.course?._id}/certificate`)}
            className="mt-4 h-[44px] w-full rounded-full bg-[#07004d] text-[12px] font-semibold text-white transition hover:bg-[#111456]"
          >
            Download Certificate
          </button>
        </div>
      ))}
    </div>
  );
}
