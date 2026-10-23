"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@utils/axiosInstance";
import FreeCourseLayout from "./components/FreeCourseLayout";
import NormalCourseLayout from "./components/NormalCourseLayout";
import { findCatalogCourse, normaliseApiCourse } from "@services/catalog";

import { Skeleton } from "../../components/Skeleton";

const CourseDetailsPage = () => {
  const { slug } = useParams()!;
  // Catalog courses render straight away; the database copy replaces it when the API answers
  const [course, setCourse] = useState<any>(() => (slug ? findCatalogCourse(String(slug)) : null));
  const [isLoading, setIsLoading] = useState(() => !course);

  useEffect(() => {
    const catalogCourse = findCatalogCourse(String(slug));
    const fetchCourse = async () => {
      try {
        setCourse(catalogCourse);
        setIsLoading(!catalogCourse);
        const res = await axiosInstance.get(`/courses/${slug}`, { timeout: catalogCourse ? 15000 : 60000 });
        // GET /courses/:slugOrId answers { course, isEnrolled }
        setCourse(normaliseApiCourse(res.data?.course ?? res.data));
      } catch (error) {
        // Not in the database (yet): keep the built-in catalog copy if there is one
        if (!catalogCourse) console.error("Failed to fetch course details", error);
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
  // Imported courses without a price are stored at 0 but are paid courses, so go by courseType when present
  if (course.courseType ? course.courseType === "free" : course.price === 0) {
    return <FreeCourseLayout course={course} />;
  }

  return <NormalCourseLayout course={course} />;
};

export default CourseDetailsPage;
