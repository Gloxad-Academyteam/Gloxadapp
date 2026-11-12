import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

// The two backends report the numbers under different names; the dashboard reads one shape.
export type TDashboardStats = {
  metrics: {
    totalStudents: number;
    totalTutors: number;
    totalCourses: number;
    totalCoursesSold: number;
    coursesCompleted: number;
    totalRevenue: number;
    activeStudents: number;
    activeTutors: number;
    passiveStudents: number;
    passiveTutors: number;
    pendingTutors: number;
    pendingCourses: number;
  };
  revenueAnalytics: { name: string; value: number }[];
  topTutors: { name: string; courses: string; img?: string }[];
};

const num = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

export async function getDashboardStats(): Promise<TService<TDashboardStats>> {
  const { data } = await axiosInstance.get("/admin/dashboard-stats");
  const m = data?.metrics ?? {};
  const s = data?.stats ?? {};
  return {
    data: {
      metrics: {
        totalStudents: num(m.totalStudents ?? s.totalStudents),
        totalTutors: num(m.totalTutors ?? s.totalInstructors),
        totalCourses: num(m.totalCourses ?? s.totalCourses),
        totalCoursesSold: num(m.totalCoursesSold ?? s.totalEnrollments),
        coursesCompleted: num(m.coursesCompleted),
        totalRevenue: num(m.totalRevenue ?? s.grossRevenue),
        activeStudents: num(m.activeStudents),
        activeTutors: num(m.activeTutors),
        passiveStudents: num(m.passiveStudents),
        passiveTutors: num(m.passiveTutors),
        pendingTutors: num(m.pendingTutors ?? s.pendingTutors),
        pendingCourses: num(m.pendingCourses ?? s.pendingCourses),
      },
      revenueAnalytics: Array.isArray(data?.revenueAnalytics) ? data.revenueAnalytics : [],
      topTutors: Array.isArray(data?.topTutors) ? data.topTutors : [],
    },
  };
}
