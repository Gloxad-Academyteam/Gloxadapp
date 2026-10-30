"use client";

import { useSearchParams } from "next/navigation";
import useAuth from "@hooks/useAuth";
import FreeCoursesTab from "./components/FreeCoursesTab";
import MyCoursesTab from "./components/MyCoursesTab";
import LearnerHome from "./components/LearnerHome";
import TrimesterCoursesTab from "./components/TrimesterCoursesTab";
import TutorDashboardPage from "@pages/Tutor/TutorDashboardPage";
import IndexPage from "../IndexPage";
import SettingsPage from "../SettingsPage";

const DashboardPage = () => {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const tab = searchParams.get("tab") || "home"; // Default to home
  const { authenticatedUser } = useAuth();

  if (authenticatedUser?.role === "instructor") {
    return <TutorDashboardPage />;
  }

  return (
    <div className="w-full bg-[#fcfcfd] min-h-[calc(100vh-136px)] pb-24">
      {tab === "home" && <LearnerHome />}
      {tab === "my-courses" && <MyCoursesTab />}
      {tab === "free" && <FreeCoursesTab />}
      {tab === "trimester" && <TrimesterCoursesTab />}
      {tab === "settings" && <SettingsPage />}

      {/* Fallback for anything else */}
      {tab !== "home" && tab !== "my-courses" && tab !== "free" && tab !== "trimester" && tab !== "settings" && (
        <IndexPage variant="dashboard" />
      )}
    </div>
  );
};

export default DashboardPage;
