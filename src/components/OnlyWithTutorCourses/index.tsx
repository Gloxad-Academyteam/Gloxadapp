"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHasTutorCourses } from "@hooks/useHasTutorCourses";

// Shows the course list only when a tutor has published a course; otherwise sends the visitor to the free courses
const OnlyWithTutorCourses = ({ children, fallback }: { children: React.ReactNode; fallback: string }) => {
  const router = useRouter();
  const { hasTutorCourses, isLoading } = useHasTutorCourses();

  useEffect(() => {
    if (!isLoading && !hasTutorCourses) router.replace(fallback);
  }, [isLoading, hasTutorCourses, fallback, router]);

  if (isLoading) return <div className="p-20 text-center text-[#717480]">Loading courses...</div>;
  return hasTutorCourses ? <>{children}</> : null;
};

export default OnlyWithTutorCourses;
