"use client";

import useAuth from "@hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";

// One /lms entry point: each role lands on its own view of the trimester programme
const DashboardRouter = () => {
  const { authenticatedUser } = useAuth();
  if (authenticatedUser?.role === "admin") return <AdminDashboard />;
  if (authenticatedUser?.role === "instructor") return <InstructorDashboard />;
  return <StudentDashboard />;
};

export default DashboardRouter;
