"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@utils/axiosInstance";
import { toast } from "react-toastify";

const FreeCoursesTab = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch courses with price=0 OR courseType=free
        const response = await axiosInstance.get("/courses?courseType=free");
        const data = response.data.courses || [];
        
        if (data.length === 0) {
          // Fallback: filter any published course by price=0
          const fallback = await axiosInstance.get("/courses?limit=20");
          const freeCourses = (fallback.data.courses || []).filter(
            (c: any) => !c.price || c.price === 0
          );
          setCourses(freeCourses);
        } else {
          setCourses(data);
        }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#166534] to-[#4ade80] group-hover:scale-105 transition-transform duration-500">
                        <span className="text-white text-[60px] font-black opacity-20">F</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#22c55e] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow animate-shimmer">
                      FREE
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    {course.category?.name && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3e92cc] bg-[#e0f2fe] px-2 py-0.5 rounded w-fit mb-2">
                        {course.category.name}
                      </span>
                    )}
                    <h3 className="text-[16px] font-bold text-[#202127] mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-[12px] text-[#717480] mb-2">by {instructor}</p>
                    <p className="text-[12px] text-[#717480] line-clamp-2 mb-4">{course.description}</p>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-[#717480]">{course.level || "Beginner"}</p>
                        <p className="text-[17px] font-bold text-[#22c55e]">Free</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/courses/${course.slug}`); }}
                        className="h-[36px] px-5 rounded-full bg-[#181C7B] text-white text-[12px] font-bold hover:bg-[#111456] transition-colors shrink-0 btn-interactive"
                      >
                        Start Learning
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default FreeCoursesTab;
