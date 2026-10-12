"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@utils/axiosInstance";
import { toast } from "react-toastify";
import { FaPlay } from "react-icons/fa";

const TrimesterCoursesTab = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/courses?courseType=trimester");
        const data = response.data.courses || [];
        // Fallback: if no trimester courses in DB yet, get all published
        if (data.length === 0) {
          const fallback = await axiosInstance.get("/courses?limit=6");
          setCourses(fallback.data.courses || []);
        } else {
          setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch trimester courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="mx-auto max-w-[1512px] px-5 md:px-10 lg:px-[120px] pt-12 pb-24">
      {/* Banner */}
      <div className="relative flex flex-col overflow-hidden rounded-[24px] md:rounded-[40px] bg-gradient-to-r from-[#07004d] to-[#7192d1] shadow-lg mb-12">
        <div className="relative flex min-h-[280px] w-full flex-col px-8 py-12 lg:flex-row lg:px-16 lg:py-16 items-center gap-8">
          <div className="flex w-full flex-col justify-center lg:w-[50%]">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit mb-4">
              🎓 Trimester Programme
            </span>
            <h2 className="text-[28px] font-bold leading-[1.2] text-white md:text-[36px]">
              Upcoming Trimester Courses
            </h2>
            <p className="mt-3 max-w-[420px] text-[14px] leading-[1.6] text-white/85">
              Enroll in our structured trimester courses before the deadline.
              Stay ahead and learn with a cohort of motivated students.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/lms")}
                className="h-[44px] px-8 rounded-full bg-white text-[14px] font-bold text-[#07004d] transition hover:bg-[#e8edf8]"
              >
                Open Trimester LMS
              </button>
              <button
                onClick={() => router.push("/courses")}
                className="h-[44px] px-8 rounded-full border border-white text-[14px] font-medium text-white transition hover:bg-white hover:text-[#07004d]"
              >
                Browse All Courses
              </button>
            </div>
          </div>
          <div className="lg:w-[50%] text-white/50 text-center text-[120px] font-black leading-none hidden lg:block select-none">
            T
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-[16px] border border-[#e2e8f0] bg-white overflow-hidden animate-pulse">
              <div className="h-[180px] bg-[#f0f4f8]" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[#f0f4f8] rounded w-3/4" />
                <div className="h-3 bg-[#f0f4f8] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#f0f4f8] flex items-center justify-center mb-4 text-3xl">🎓</div>
          <h3 className="text-[18px] font-bold text-[#202127] mb-2">No Trimester Courses Yet</h3>
          <p className="text-[14px] text-[#717480]">Check back soon for upcoming trimester enrolments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const instructor = course.instructor
              ? `${course.instructor.firstName} ${course.instructor.lastName}`
              : "Gloxad Academy";
            const thumbnailUrl = course.thumbnailUrl?.startsWith("http")
              ? course.thumbnailUrl
              : null;

            return (
              <article
                key={course._id}
                onClick={() => router.push(`/courses/${course.slug}`)}
                className="cursor-pointer flex flex-col overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white shadow-sm transition card-interactive group"
              >
                <div className="relative h-[180px] overflow-hidden bg-[#f0f4f8]">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#07004d] to-[#7192d1] group-hover:scale-105 transition-transform duration-500">
                      <span className="text-white text-[48px] font-black opacity-30">T</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <FaPlay className="text-[#07004d] text-[16px] ml-1" />
                    </div>
                  </div>
                  {course.price === 0 && (
                    <span className="absolute top-3 left-3 bg-[#22c55e] text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-shimmer">
                      FREE
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {course.category?.name && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3e92cc] bg-[#e0f2fe] px-2 py-0.5 rounded">
                        {course.category.name}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c3aed] bg-[#ede9fe] px-2 py-0.5 rounded animate-shimmer">
                      TRIMESTER
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#202127] mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-[12px] text-[#717480] mb-4">by {instructor}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#717480]">{course.level || "All Levels"}</p>
                      {course.price > 0 ? (
                        <p className="text-[17px] font-bold text-[#202127]">
                          ₦{course.price?.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-[17px] font-bold text-[#22c55e]">Free</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/courses/${course.slug}`); }}
                      className="h-[36px] px-5 rounded-full bg-[#181C7B] text-white text-[12px] font-bold hover:bg-[#111456] transition-colors"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrimesterCoursesTab;
