"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@hooks/useAuth";
import { PageSpinner } from "@components/Spinner";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";

// One /lms entry point: each role lands on its own view of the trimester programme.
// Admins have their own area with real numbers, so they are sent there.
const DashboardRouter = () => {
  const { authenticatedUser } = useAuth();
  const router = useRouter();
  const isAdmin = authenticatedUser?.role === "admin";

  useEffect(() => {
    if (isAdmin) router.replace("/admin");
  }, [isAdmin, router]);

  if (isAdmin) return <PageSpinner />;
  if (authenticatedUser?.role === "instructor") return <InstructorDashboard />;
  return <StudentDashboard />;
};

export default DashboardRouter;
