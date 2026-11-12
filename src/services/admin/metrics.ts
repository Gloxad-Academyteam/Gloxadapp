import axiosInstance from "@utils/axiosInstance";

export type TRangeDays = 7 | 30 | 90 | 365;

export type TSeriesPoint = { key: string; label: string };

export type TAnalytics = {
  range: { days: number; bucket: "day" | "month"; from: string; to: string };
  totals: {
    users: number;
    students: number;
    tutors: number;
    enrolments: number;
    revenueAllTime: number;
    completionRate: number | null;
    certificatesIssued: number;
    sessionsHeld: number;
    cohortsRunning: number;
  };
  period: {
    newUsers: number;
    newUsersChange: number | null;
    revenue: number;
    revenueChange: number | null;
    transactions: number;
    enrolments: number;
    enrolmentsChange: number | null;
  };
  series: {
    signups: (TSeriesPoint & { students: number; tutors: number; total: number })[];
    revenue: (TSeriesPoint & { value: number; transactions: number })[];
    enrolments: (TSeriesPoint & { value: number })[];
  };
  engagement: { activeStudents: number; passiveStudents: number; activeTutors: number; passiveTutors: number; windowDays: number };
  courseStatus: Record<string, number>;
  topCourses: { id: string; title: string; enrolments: number; revenue: number }[];
  topTutors: { id: string; name: string; avatar: string; students: number; courses: number }[];
  programme: { enrolmentsByStatus: Record<string, number>; scholarshipApplicationsByStatus: Record<string, number> };
};

type TPresence = { total: number; student: number; instructor: number; admin: number };
type TLiveClass = { id: string; title: string; tutor: string; cohort: string; startsAt: string; participants: number };

export type TLiveMetrics = {
  asOf: string;
  online: { now: TPresence; last15m: TPresence; last60m: TPresence };
  liveClasses: TLiveClass[];
  upcomingClasses: TLiveClass[];
  today: { signups: number; enrolments: number; revenue: number; payments: number; scholarshipApplications: number };
  queue: { pendingTutors: number; pendingCourses: number; scholarshipApplications: number; appeals: number };
  recent: { type: "signup" | "enrolment" | "payment" | "scholarship" | "certificate"; text: string; at: string }[];
  system: { database: string; uptimeSeconds: number; memoryMb: number; environment: string };
};

export const getAnalytics = async (days: TRangeDays): Promise<TAnalytics> => {
  const { data } = await axiosInstance.get("/admin/analytics", { params: { days } });
  return data;
};

export const getLiveMetrics = async (): Promise<TLiveMetrics> => {
  const { data } = await axiosInstance.get("/admin/live-metrics");
  return data;
};
