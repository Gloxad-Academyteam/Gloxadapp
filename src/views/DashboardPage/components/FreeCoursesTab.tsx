"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "@components/CourseCard";
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
          Explore our free courses and upgrade anytime to get a certificate!
        </p>
      </div>

      {/* Courses Grid */}
      <div className="mx-auto max-w-[1512px] px-5 md:px-10 lg:px-[120px] pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-[16px] border border-[#e2e8f0] bg-white overflow-hidden animate-pulse">
                <div className="h-[180px] bg-[#f0f4f8]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[#f0f4f8] rounded w-3/4" />
                  <div className="h-3 bg-[#f0f4f8] rounded w-1/2" />
                  <div className="h-3 bg-[#f0f4f8] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-[18px] font-bold text-[#202127] mb-2">No Free Courses Yet</h3>
            <p className="text-[14px] text-[#717480]">Check back soon — free courses will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
