"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@utils/axiosInstance";
import FreeCourseLayout from "./components/FreeCourseLayout";
import NormalCourseLayout from "./components/NormalCourseLayout";

import { Skeleton } from "../../components/Skeleton";

const CourseDetailsPage = () => {
  const { slug } = useParams()!;
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/courses/${slug}`);
        setCourse(res.data);
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchCourse();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#fcfcfd] p-6 lg:p-12 space-y-8 max-w-[1280px] mx-auto">
        <Skeleton className="w-3/4 h-10 rounded-lg" />
        <Skeleton className="w-1/2 h-6 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-full h-[360px] rounded-[20px]" />
            <Skeleton className="w-full h-24 rounded-[16px]" />
            <Skeleton className="w-full h-40 rounded-[16px]" />
          </div>
          <div className="space-y-6">
            <Skeleton className="w-full h-[420px] rounded-[24px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfd]">Course not found</div>;
  }

  // If price is strictly 0 (or course.isFree), show the Free Layout.
  // Otherwise show the Normal (Paid) layout.
  if (course.price === 0) {
    return <FreeCourseLayout course={course} />;
  }

  return <NormalCourseLayout course={course} />;
};

export default CourseDetailsPage;
