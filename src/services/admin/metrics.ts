import axiosInstance from "@utils/axiosInstance";

export type TRangeDays = 7 | 30 | 90 | 365;

export type TSeriesPoint = { key: string; label: string };

export type TAnalytics = {
  // "basic" when the server has no analytics endpoint yet and the numbers are put together from what it does offer
  source?: "full" | "basic";
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
  source?: "full" | "basic";
  online: { now: TPresence; last15m: TPresence; last60m: TPresence } | null;
  liveClasses: TLiveClass[];
  upcomingClasses: TLiveClass[];
  today: { signups: number; enrolments: number; revenue: number; payments: number; scholarshipApplications: number };
  queue: { pendingTutors: number; pendingCourses: number; scholarshipApplications: number; appeals: number };
  recent: { type: "signup" | "enrolment" | "payment" | "scholarship" | "certificate"; text: string; at: string }[];
  traffic: { series: { at: string; requests: number; errors: number }[]; requests: number; errors: number; serverErrors: number; requestsLast5m: number; perMinute: number } | null;
  system: { database: string; uptimeSeconds: number; memoryMb: number; environment: string } | null;
};

export type TActivityCategory = "auth" | "course" | "learning" | "payment" | "live" | "message" | "admin" | "tutor" | "institution" | "other";

export type TActivityItem = {
  id: string;
  at: string;
  label: string;
  category: TActivityCategory;
  method: string;
  path: string;
  status: number;
  ok: boolean;
  durationMs: number;
  actor: { id: string; name: string; email: string; role: string };
  targetId: string;
  ip: string;
  userAgent: string;
};

export type TActivityPage = {
  items: TActivityItem[];
  total: number;
  page: number;
  totalPages: number;
  summary: { last24h: number; failed24h: number; byCategory: Record<string, number> };
};

export type TActivityFilters = { category?: string; role?: string; ok?: "true" | "false" | ""; search?: string; page?: number; limit?: number };

export const getActivity = async (filters: TActivityFilters): Promise<TActivityPage> => {
  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined));
  const { data } = await axiosInstance.get("/admin/activity", { params });
  return data;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 24 * 60 * 60 * 1000;
const num = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : 0);
const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const monthKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

const buildBuckets = (days: number, bucket: "day" | "month") => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets: { key: string; label: string }[] = [];
  if (bucket === "month") {
    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      buckets.push({ key: monthKey(date), label: MONTHS[date.getMonth()] });
    }
  } else {
    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date(today.getTime() - i * DAY_MS);
      buckets.push({ key: dayKey(date), label: `${date.getDate()} ${MONTHS[date.getMonth()]}` });
    }
  }
  return buckets;
};

const safe = async <T,>(request: Promise<{ data: T }>): Promise<T | null> => {
  try {
    return (await request).data;
  } catch {
    return null;
  }
};

/**
 * Used when the server has no /admin/analytics yet. It builds the same picture from the endpoints every
 * version of the server has: platform stats, finance, recent registrations and recent payments.
 */
const basicAnalytics = async (days: TRangeDays): Promise<TAnalytics> => {
  const [stats, finance, registrations, payments, courses] = await Promise.all([
    safe<any>(axiosInstance.get("/admin/dashboard-stats")),
    safe<any>(axiosInstance.get("/admin/finance")),
    safe<any>(axiosInstance.get("/admin/recent-registrations", { params: { limit: 50 } })),
    safe<any>(axiosInstance.get("/admin/recent-transactions", { params: { limit: 50 } })),
    safe<any>(axiosInstance.get("/admin/courses/all")),
  ]);
  if (!stats && !finance && !registrations) throw new Error("No admin data could be loaded");

  const m = stats?.metrics ?? {};
  const st = stats?.stats ?? {};
  const bucket: "day" | "month" = days === 365 ? "month" : "day";
  const buckets = buildBuckets(days, bucket);
  const keyOf = bucket === "month" ? monthKey : dayKey;
  const from = new Date(buckets[0].key.length === 7 ? `${buckets[0].key}-01T00:00:00` : `${buckets[0].key}T00:00:00`);

  const signupMap = new Map<string, { students: number; tutors: number; total: number }>();
  let newUsers = 0;
  for (const user of registrations?.users ?? []) {
    const created = new Date(user.createdAt);
    if (Number.isNaN(created.getTime()) || created < from) continue;
    newUsers += 1;
    const row = signupMap.get(keyOf(created)) ?? { students: 0, tutors: 0, total: 0 };
    row.total += 1;
    if (user.role === "student") row.students += 1;
    if (user.role === "instructor") row.tutors += 1;
    signupMap.set(keyOf(created), row);
  }

  const revenueMap = new Map<string, { value: number; transactions: number }>();
  let periodRevenue = 0;
  let periodPayments = 0;
  if (bucket === "month" && Array.isArray(finance?.finance?.monthlyBreakdown)) {
    for (const row of finance.finance.monthlyBreakdown) {
      revenueMap.set(String(row.month), { value: num(row.revenue), transactions: num(row.transactions) });
      periodRevenue += num(row.revenue);
      periodPayments += num(row.transactions);
    }
  } else {
    for (const payment of payments?.transactions ?? []) {
      const created = new Date(payment.createdAt);
      if (payment.status !== "success" || Number.isNaN(created.getTime()) || created < from) continue;
      const row = revenueMap.get(keyOf(created)) ?? { value: 0, transactions: 0 };
      row.value += num(payment.amount);
      row.transactions += 1;
      revenueMap.set(keyOf(created), row);
      periodRevenue += num(payment.amount);
      periodPayments += 1;
    }
  }

  const statuses: Record<string, number> = {};
  for (const course of courses?.courses ?? []) {
    const status = String(course.status || "draft").toLowerCase();
    statuses[status === "approved" ? "published" : status] = (statuses[status === "approved" ? "published" : status] || 0) + 1;
  }
  if (Object.keys(statuses).length === 0) {
    if (num(st.publishedCourses)) statuses.published = num(st.publishedCourses);
    if (num(st.pendingCourses)) statuses.pending = num(st.pendingCourses);
    if (num(st.rejectedCourses)) statuses.rejected = num(st.rejectedCourses);
  }

  const students = num(m.totalStudents ?? st.totalStudents);
  const tutors = num(m.totalTutors ?? st.totalInstructors);
  const enrolments = num(m.totalCoursesSold ?? st.totalEnrollments);
  const revenueAllTime = num(m.totalRevenue ?? st.grossRevenue ?? finance?.finance?.grossRevenue);
  const completed = num(m.coursesCompleted);

  return {
    source: "basic",
    range: { days, bucket, from: from.toISOString(), to: new Date().toISOString() },
    totals: {
      users: num(st.totalUsers) || students + tutors,
      students,
      tutors,
      enrolments,
      revenueAllTime,
      completionRate: enrolments > 0 && completed > 0 ? Math.round((completed / enrolments) * 100) : null,
      certificatesIssued: 0,
      sessionsHeld: 0,
      cohortsRunning: 0,
    },
    period: { newUsers, newUsersChange: 0, revenue: periodRevenue, revenueChange: 0, transactions: periodPayments, enrolments: 0, enrolmentsChange: 0 },
    series: {
      signups: buckets.map((b) => ({ ...b, ...(signupMap.get(b.key) ?? { students: 0, tutors: 0, total: 0 }) })),
      revenue: buckets.map((b) => ({ ...b, ...(revenueMap.get(b.key) ?? { value: 0, transactions: 0 }) })),
      enrolments: buckets.map((b) => ({ ...b, value: 0 })),
    },
    engagement: {
      activeStudents: num(m.activeStudents),
      passiveStudents: num(m.passiveStudents),
      activeTutors: num(m.activeTutors),
      passiveTutors: num(m.passiveTutors),
      windowDays: 30,
    },
    courseStatus: statuses,
    topCourses: [],
    topTutors: [],
    programme: { enrolmentsByStatus: {}, scholarshipApplicationsByStatus: {} },
  };
};

const isMissingEndpoint = (error: any) => {
  const status = error?.response?.status;
  return status !== 401 && status !== 403;
};

export const getAnalytics = async (days: TRangeDays): Promise<TAnalytics> => {
  try {
    const { data } = await axiosInstance.get("/admin/analytics", { params: { days } });
    return { ...data, source: "full" };
  } catch (error) {
    if (!isMissingEndpoint(error)) throw error;
    return basicAnalytics(days);
  }
};

const basicLiveMetrics = async (): Promise<TLiveMetrics> => {
  const [stats, registrations, payments] = await Promise.all([
    safe<any>(axiosInstance.get("/admin/dashboard-stats")),
    safe<any>(axiosInstance.get("/admin/recent-registrations", { params: { limit: 50 } })),
    safe<any>(axiosInstance.get("/admin/recent-transactions", { params: { limit: 50 } })),
  ]);
  if (!stats && !registrations && !payments) throw new Error("No admin data could be loaded");

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const st = stats?.stats ?? {};
  const m = stats?.metrics ?? {};
  const users: any[] = registrations?.users ?? [];
  const paid: any[] = (payments?.transactions ?? []).filter((payment: any) => payment.status === "success");
  const name = (person: any) => [person?.firstName, person?.lastName].filter(Boolean).join(" ");

  const recent: TLiveMetrics["recent"] = [
    ...users.map((user) => ({ type: "signup" as const, text: `${name(user) || user.email} joined as ${user.role === "instructor" ? "a tutor" : user.role === "admin" ? "an admin" : `a ${user.role}`}`, at: user.createdAt })),
    ...paid.map((payment) => ({ type: "payment" as const, text: `₦${num(payment.amount).toLocaleString()} paid for ${payment.course?.title || "a course"}`, at: payment.createdAt })),
  ]
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 14);

  return {
    source: "basic",
    asOf: new Date().toISOString(),
    online: null,
    liveClasses: [],
    upcomingClasses: [],
    today: {
      signups: users.filter((user) => new Date(user.createdAt) >= startOfToday).length,
      enrolments: 0,
      revenue: paid.filter((payment) => new Date(payment.createdAt) >= startOfToday).reduce((sum, payment) => sum + num(payment.amount), 0),
      payments: paid.filter((payment) => new Date(payment.createdAt) >= startOfToday).length,
      scholarshipApplications: 0,
    },
    queue: { pendingTutors: num(st.pendingTutors ?? m.pendingTutors), pendingCourses: num(st.pendingCourses ?? m.pendingCourses), scholarshipApplications: 0, appeals: 0 },
    recent,
    traffic: null,
    system: null,
  };
};

export const getLiveMetrics = async (): Promise<TLiveMetrics> => {
  try {
    const { data } = await axiosInstance.get("/admin/live-metrics");
    return { ...data, source: "full" };
  } catch (error) {
    if (!isMissingEndpoint(error)) throw error;
    return basicLiveMetrics();
  }
};
