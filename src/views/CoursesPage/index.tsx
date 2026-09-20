"use client";

import React from "react";
import { useCoursesPage } from "./hooks/useCoursesPage";
import ExploreCourseCard from "./components/ExploreCourseCard";

const CoursesPage = () => {
  const { courses, isLoading, error } = useCoursesPage();

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-[1512px] px-5 py-10 md:px-10 md:py-14 lg:px-8 xl:px-[120px]">
      
      {/* Header Area */}
      <div className="mx-auto mb-10 flex max-w-[800px] flex-col items-center gap-3 text-center md:mb-14">
        <h1 className="text-[28px] font-semibold text-[#201633] md:text-[36px]">
          Explore Courses
        </h1>
        <p className="max-w-[600px] text-[14px] leading-relaxed text-[#4e515c] md:text-[15px]">
          Access high-quality courses designed to help you learn new skills, grow your expertise, and achieve your goals—all at no cost.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {isLoading ? (
          <div className="w-full h-[40vh] flex items-center justify-center">
            <p className="text-title-large text-neutral-8 animate-pulse">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="w-full h-[40vh] flex items-center justify-center">
            <p className="text-title-large text-error-5">Failed to load courses. Please try again.</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-[16px] p-12 text-center border-[1px] border-neutral-4 shadow-sm">
            <h2 className="text-title-large font-bold text-neutral-10 mb-2">No courses found</h2>
            <p className="text-body-medium text-neutral-7">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course: any) => {
              const frontendCourse = {
                id: course._id,
                title: course.title,
                description: course.description,
                imageUrl: course.thumbnailUrl || "https://via.placeholder.com/400x230",
                url: `/courses/${course.slug}`,
                level: course.level,
                closingDate: course.closingDate,
              };
              return <ExploreCourseCard key={course._id} course={frontendCourse} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
