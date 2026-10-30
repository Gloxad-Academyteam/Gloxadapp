"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";

export default function CourseCompletedPage() {
  const { id: courseId } = useParams()!;
  const router = useRouter();

  const { data: course } = useQuery({
    queryKey: ["course.completed", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      return res.data?.course ?? res.data;
    },
    enabled: !!courseId,
  });

  return (
    <div className="w-full bg-white px-5 pb-24 pt-6 text-[#201633] md:px-10">
      <div className="mx-auto max-w-[900px]">
        <button type="button" onClick={() => router.push("/dashboard/courses")} className="flex items-center gap-1 text-[13px] text-[#4e515c] hover:text-[#07004d]">
          <FiChevronLeft /> Back
        </button>

        <div className="mt-10 text-center">
          {/* Graduate illustration */}
          <div className="mx-auto flex h-[210px] w-[210px] items-center justify-center rounded-full bg-[#f9dcb4]">
            <svg viewBox="0 0 120 120" className="h-[150px] w-[150px]" role="img" aria-label="Graduate">
              <circle cx="60" cy="52" r="20" fill="#f2c9a5" />
              <path d="M30 108c0-24 12-38 30-38s30 14 30 38z" fill="#1d1d3a" />
              <path d="M52 72l8 14 8-14z" fill="#3e6ab3" />
              <path d="M60 20L22 36l38 16 38-16z" fill="#1d1d3a" />
              <path d="M40 46v14c0 6 9 10 20 10s20-4 20-10V46l-20 8z" fill="#1d1d3a" />
              <path d="M96 38v18" stroke="#f5b400" strokeWidth="3" />
              <circle cx="96" cy="58" r="3" fill="#f5b400" />
            </svg>
          </div>

          <div className="mx-auto mt-10 max-w-[620px] text-[14px] leading-[1.9]">
            <p>🎉 Congratulations!</p>
            <p>You have successfully completed your {course?.title || "course"}.</p>
            <p>All of us at Gloxad celebrate you and your achievement.</p>
            <p>We're proud of your dedication and growth — this is just the beginning of your learning journey!</p>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/learning/${courseId}/certificate`)}
            className="mx-auto mt-12 block h-[52px] w-full max-w-[520px] rounded-full bg-[#07004d] text-[13px] font-semibold text-white transition hover:bg-[#111456]"
          >
            View and Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
