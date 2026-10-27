"use client";

import React from "react";
import Link from "next/link";
import { catalogCourses } from "@services/catalog";

// Every course in the catalog is free, so the page lists all of them
const freeCourses = catalogCourses.filter((course) => course.courseType === "free");

const FreeCoursesPage = () => {
  return (
    <div className="w-full bg-white font-sans">
      <main className="mx-auto min-h-[60vh] w-full max-w-[1512px] px-5 py-10 md:px-10 md:py-14 lg:px-8 xl:px-[120px]">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-[720px] text-center md:mb-14">
          <h1 className="text-[28px] font-semibold text-[#201633] md:text-[36px]">Free Courses</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[#4e515c] md:text-[15px]">
            {freeCourses.length} free courses. Explore them and upgrade anytime to get a certificate!
          </p>
        </div>

        {/* Grid: 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {freeCourses.map((course) => (
            <article key={course.slug} className="card-interactive group flex flex-col">
              <div className="overflow-hidden rounded-[10px] bg-[#f4f5f8]">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  loading="lazy"
                  className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[190px]"
                />
              </div>
              <div className="flex flex-1 flex-col pt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#3e92cc]">{course.programme}</p>
                <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-tight text-[#201633]">{course.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.55] text-[#6b6d76]">{course.subtitle}</p>
                <p className="mt-3 text-[12px] font-medium text-[#F97316]">
                  {course.videos.length} video lessons · {course.videoHours} hours
                </p>
                <p className="mt-1 text-[12px] text-[#8a8c95]">{course.level}</p>
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-interactive mt-4 inline-flex h-[36px] w-max items-center rounded-full bg-[#07004d] px-6 text-[13px] font-medium text-white transition hover:bg-[#111456]"
                >
                  Start Learning
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FreeCoursesPage;
