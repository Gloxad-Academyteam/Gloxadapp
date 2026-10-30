"use client";

import React from "react";
import { useHasTutorCourses } from "@hooks/useHasTutorCourses";

// Shows its children only once a tutor has published a course
const TutorCoursesOnly = ({ children }: { children: React.ReactNode }) => {
  const { hasTutorCourses } = useHasTutorCourses();
  return hasTutorCourses ? <>{children}</> : null;
};

export default TutorCoursesOnly;
