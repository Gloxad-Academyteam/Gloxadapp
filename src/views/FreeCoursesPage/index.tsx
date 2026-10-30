"use client";

import React from "react";
import CourseCard from "@components/CourseCard";
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

        {/* 1 column on phones, 2 on tablets, 3 on desktop */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {freeCourses.map((course) => (
            <CourseCard
              key={course.slug}
              href={`/courses/${course.slug}`}
              title={course.title}
              image={course.thumbnail}
              provider="Gloxad Academy"
              tag={course.programme}
              meta={[course.level, `${course.videos.length} video lessons`, `${course.videoHours} hours`]}
              priceLabel="Free"
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default FreeCoursesPage;
