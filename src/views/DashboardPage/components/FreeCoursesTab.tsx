"use client";

import React, { useEffect, useState } from "react";
import CourseCard, { COURSE_GRID } from "@components/CourseCard";
import { CourseGridSkeleton } from "@components/CourseCard/Skeleton";
import { useRouter } from "next/navigation";
import axiosInstance from "@utils/axiosInstance";
import { toast } from "react-toastify";
import { getYouTubeSourceName, isFreeYouTubeCourse } from "@utils/courseSource";

const FreeCoursesTab = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchPages = async (params: Record<string, string | number>) => {
          const first = await axiosInstance.get("/courses", { params: { ...params, limit: 50, page: 1 } });
          const firstCourses = first.data?.courses || [];
          const totalPages = Math.max(1, Number(first.data?.pagination?.totalPages) || 1);
          const remaining = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              axiosInstance.get("/courses", { params: { ...params, limit: 50, page: index + 2 } }),
            ),
          );
          return [firstCourses, ...remaining.map((response) => response.data?.courses || [])]
            .flat()
            .filter(isFreeYouTubeCourse);
        };

        let freeCourses = await fetchPages({ courseType: "free" });
        if (freeCourses.length === 0) freeCourses = await fetchPages({});
        setCourses(freeCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-16 pb-12 px-4 text-center bg-gradient-to-b from-[#f0f7ff] to-white">
        <span className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#166534] text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
          🎁 100% Free
        </span>
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#202127] mb-3">
          Start Learning for Free!
        </h1>
        <p className="text-[16px] text-[#4e515c] max-w-[500px]">
            Explore free courses with lessons, assessments and completion certificates included at no charge.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="mx-auto max-w-[1512px] px-5 md:px-10 lg:px-[120px] pb-24">
        {isLoading ? (
          <CourseGridSkeleton count={6} />
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-[18px] font-bold text-[#202127] mb-2">No Free Courses Yet</h3>
            <p className="text-[14px] text-[#717480]">Check back soon — free courses will appear here.</p>
          </div>
        ) : (
          <div className={COURSE_GRID}>
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                href={`/courses/${course.slug}`}
                title={course.title}
                image={course.thumbnailUrl?.startsWith("http") ? course.thumbnailUrl : null}
                provider={getYouTubeSourceName(course)}
                providerAvatar
                tag={course.category?.name}
                meta={[course.level || "Beginner"]}
                priceLabel="Free"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FreeCoursesTab;
