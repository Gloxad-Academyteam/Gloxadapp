"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { visibleCatalogCourses } from "@services/catalog";

type TProps = { search: string };

/** The free courses the site offers learners. They come from the free catalog, not from tutors. */
const FreeCoursesPanel = ({ search }: TProps) => {
  const courses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return visibleCatalogCourses
      .filter((course) => course.courseType === "free")
      .filter((course) => !query || `${course.title} ${course.category} ${course.sourceName}`.toLowerCase().includes(query));
  }, [search]);

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
      <div className="flex items-center justify-between border-b border-[#eef0f6] px-6 py-4">
        <p className="text-[14px] text-[#4e515c]"><b className="text-[#202127]">{courses.length}</b> free {courses.length === 1 ? "course" : "courses"} offered to learners</p>
        <Link href="/free" target="_blank" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#181C7B] hover:underline">
          Open the free courses page <FiExternalLink size={14} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#fafbfc]">
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">Course</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">Provider</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">Category</th>
              <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">Length</th>
              <th className="px-6 py-4 text-right text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">View</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-[#8a90a8]">No free courses match.</td></tr>
            ) : (
              courses.map((course) => (
                <tr key={course.slug} className="border-b border-[#f0f4f8] last:border-none hover:bg-[#f8fafc]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={course.thumbnailUrl} alt="" loading="lazy" className="h-10 w-14 shrink-0 rounded-[6px] bg-[#eef0f6] object-cover" />
                      <span className="font-semibold text-[#202127]">{course.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#4e515c]">{course.sourceName}</td>
                  <td className="px-6 py-4 text-[#4e515c]">{course.category}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-[#4e515c]">{course.videoHours ? `${course.videoHours} hours` : course.duration}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/courses/${course.slug}`} target="_blank" className="inline-flex items-center rounded-full bg-[#f0f4f8] px-4 py-1.5 text-[12px] font-bold text-[#181C7B] hover:bg-[#e2e8f0]">Open</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreeCoursesPanel;
