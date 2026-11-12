import axios from "axios";
import axiosInstance from "@utils/axiosInstance";
import { getPresignedUrl } from "@services/upload";

export type TLmsCohort = {
  _id: string;
  name: string;
  role: "student" | "instructor" | "admin";
  startsAt: string;
  status: string;
  trimester: { _id: string; name: string; programName: string; startsAt: string; endsAt: string };
};

export type TApiDayItem = { _id: string; kind: "video" | "reading" | "code" | "check" | "live" | "problems" | "review" | "submission"; label: string; labSlug: string | null; lessonRef: string | null; done: boolean };
export type TApiDay = { day: string; dayIndex: number; date: string; status: "done" | "today" | "available" | "upcoming" | "locked"; module?: string; title?: string; progress?: number; items?: TApiDayItem[] };
export type TApiWeek = {
  weekNumber: number;
  objective: { title: string; text: string };
  estimatedHours: number;
  concepts: string[];
  progress: number;
  totalItems: number;
  doneItems: number;
  days: TApiDay[];
};

export type TLivePoll = { _id: string; question: string; isOpen: boolean; options: { index: number; text: string; votes: number }[]; totalVotes: number; myVote: number | null };
export type TLiveSession = {
  _id: string;
  title: string;
  description?: string;
  cohortId?: string;
  instructor: { _id: string; name: string } | string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "live" | "ended";
  // True from 10 minutes before the start until the class ends. The server checks the same window when joining.
  canJoin: boolean;
  isHost?: boolean;
  polls?: TLivePoll[];
};
export type TLiveMessage = { _id: string; system: boolean; text: string; author: { _id: string; name: string } | null; createdAt: string };
// What the server hands out to enter the video room (LiveKit)
export type TRoomCredentials = { provider: string; serverUrl: string; roomToken: string; roomName: string; role: "host" | "viewer" };

export type TApiDashboard = {
  cohort: { trimester: { name: string; programName: string } };
  currentWeek: number;
  progress: { overall: number; week: { weekNumber: number; percent: number }; assignments: { done: number; total: number }; attendance: { attended: number; total: number; percent: number | null } };
  upNext: { kind: string; label: string; title: string; module: string; labSlug: string | null } | null;
  upcoming: { type: string; title: string; detail: string; dueAt: string; labSlug?: string | null }[];
  announcements: { title: string; text: string; createdAt: string }[];
};

// Coding labs as the server describes them
export type TLabTest = { name: string; input: string; expectedOutput: string; hidden: boolean };
export type TApiLabSummary = { _id: string; title: string; description: string; language: string; dueAt: string | null; status: "not_started" | "in_progress" | "submitted"; passedTests: number; totalTests: number; submittedAt: string | null; hasDraft: boolean };
export type TApiLabDetail = {
  _id: string;
  title: string;
  description: string;
  instructions: string;
  language: "javascript" | "typescript" | "python" | "html" | "css" | "sql";
  starterCode: string;
  testCases: TLabTest[];
  dueAt: string | null;
  draftCode: string;
  lastAutosavedAt: string | null;
  status: string;
  passedTests: number;
  totalTests: number;
  unverified: boolean;
};

export type TApiInquiry = { _id: string; reference: string; category: "academics" | "technical" | "billing"; subject: string; description?: string; status: "pending" | "in_progress" | "resolved"; createdAt: string };

// ---------------------------------------------------------------------------------------------------------------
// Adapters. The main backend serves the LMS by cohort (modules, lessons, quizzes, assignments, LiveKit rooms). The pages
// were designed around weeks and five-day cards, so these functions build that view from what the server returns.
// ---------------------------------------------------------------------------------------------------------------

type TApiCohort = {
  _id: string;
  name: string;
  trimester: { _id: string; title: string; startDate: string; endDate: string; weeks: number } | null;
  programTitle: string;
  currentWeek: number;
  status: string;
};
type TApiLesson = { _id: string; title: string; duration?: string; completed?: boolean };
type TApiModule = { _id: string; title: string; lessons: TApiLesson[]; quizzes?: { _id: string; title: string }[] };
type TApiAssignment = { _id: string; title: string; summary?: string; dueAt: string; submissionStatus?: string | null };
type TApiSession = { _id: string; title: string; cohortId: { _id: string } | string; instructorId?: { _id: string; firstName?: string; lastName?: string } | string; startsAt: string; endsAt: string; status: "scheduled" | "live" | "ended" };

const cohortParams = (cohortId?: string) => (cohortId ? { cohortId } : {});
const DAY_MS = 86_400_000;
const mapCohort = (cohort: TApiCohort, role: TLmsCohort["role"]): TLmsCohort => ({
  _id: cohort._id,
  name: cohort.name,
  role,
  startsAt: cohort.trimester?.startDate ?? "",
  status: cohort.status,
  trimester: { _id: cohort.trimester?._id ?? "", name: cohort.trimester?.title ?? cohort.name, programName: cohort.programTitle, startsAt: cohort.trimester?.startDate ?? "", endsAt: cohort.trimester?.endDate ?? "" },
});
const minutesOf = (duration?: string) => {
  const [m, sec] = String(duration ?? "0:0").split(":").map(Number);
  return (m || 0) + (sec || 0) / 60;
};
// A session may be joined from 10 minutes before it starts until it ends. The server enforces the same window.
const canJoinNow = (session: { startsAt: string; status: string }) => session.status !== "ended" && Date.now() >= new Date(session.startsAt).getTime() - 10 * 60 * 1000;
const hostName = (host: TApiSession["instructorId"]) => (host && typeof host === "object" ? [host.firstName, host.lastName].filter(Boolean).join(" ") || "Tutor" : "Tutor");

const DAYS = [
  { day: "Monday", title: "Learning" },
  { day: "Tuesday", title: "Practice" },
  { day: "Wednesday", title: "Instructor Session" },
  { day: "Thursday", title: "Applied Learning" },
  { day: "Friday", title: "Assessment" },
];

const buildWeek = (weekNumber: number, modules: TApiModule[], cohort: TLmsCohort, assignments: TApiAssignment[], labs: TApiLabSummary[], sessions: TApiSession[]): TApiWeek => {
  const module = modules[weekNumber - 1];
  const weekStart = new Date(cohort.trimester.startsAt || Date.now()).getTime() + (weekNumber - 1) * 7 * DAY_MS;
  const weekEnd = weekStart + 7 * DAY_MS;
  const perDay: TApiDayItem[][] = [[], [], [], [], []];

  (module?.lessons ?? []).forEach((lesson) => perDay[0].push({ _id: lesson._id, kind: "video", label: lesson.title, labSlug: null, lessonRef: lesson._id, done: Boolean(lesson.completed) }));
  // Labs and assignments do not belong to a module in the data, so a lab goes to week (index mod weeks) and an assignment to the week named in its title, else by order
  labs.forEach((lab, index) => {
    if (index % Math.max(modules.length, 1) === weekNumber - 1) perDay[1].push({ _id: `x:lab:${lab._id}`, kind: "code", label: lab.title, labSlug: lab._id, lessonRef: null, done: lab.status === "submitted" });
  });
  sessions
    .filter((session) => new Date(session.startsAt).getTime() >= weekStart && new Date(session.startsAt).getTime() < weekEnd)
    .forEach((session) => perDay[2].push({ _id: `x:live:${session._id}`, kind: "live", label: session.title, labSlug: null, lessonRef: null, done: session.status === "ended" }));
  assignments.forEach((assignment, index) => {
    const named = /week\s*(\d+)/i.exec(assignment.title)?.[1];
    if ((named ? Number(named) : index + 1) === weekNumber) perDay[3].push({ _id: `x:assignment:${assignment._id}`, kind: "problems", label: assignment.title, labSlug: null, lessonRef: null, done: Boolean(assignment.submissionStatus) });
  });
  (module?.quizzes ?? []).forEach((quiz) => perDay[4].push({ _id: `x:quiz:${quiz._id}`, kind: "check", label: quiz.title, labSlug: null, lessonRef: null, done: false }));

  const today = new Date();
  const days: TApiDay[] = DAYS.map((entry, index) => {
    const date = new Date(weekStart + index * DAY_MS);
    const items = perDay[index];
    const done = items.filter((item) => item.done).length;
    const isToday = date.toDateString() === today.toDateString();
    const status: TApiDay["status"] = items.length > 0 && done === items.length ? "done" : isToday ? "today" : date.getTime() < today.getTime() ? "available" : "upcoming";
    return { ...entry, dayIndex: index + 1, date: date.toISOString(), status, module: module?.title, progress: items.length ? Math.round((done / items.length) * 100) : 0, items };
  });
  const all = days.flatMap((day) => day.items ?? []);
  const doneItems = all.filter((item) => item.done).length;
  return {
    weekNumber,
    objective: { title: module?.title ?? `Week ${weekNumber}`, text: "" },
    estimatedHours: Math.round(((module?.lessons ?? []).reduce((sum, lesson) => sum + minutesOf(lesson.duration), 0) / 60) * 10) / 10,
    concepts: [],
    progress: all.length ? Math.round((doneItems / all.length) * 100) : 0,
    totalItems: all.length,
    doneItems,
    days,
  };
};

const cohortFor = async (cohortId?: string): Promise<TLmsCohort> => {
  const me = await lmsApi.me();
  const cohort = me.cohorts.find((item) => item._id === (cohortId ?? me.activeCohortId)) ?? me.cohorts[0];
  if (!cohort) throw Object.assign(new Error("No cohort"), { response: { status: 404, data: { error: "You are not in a cohort yet" } } });
  return cohort;
};
const modulesOf = async (cohortId: string) => ((await axiosInstance.get(`/lms/cohorts/${cohortId}/curriculum`)).data.modules ?? []) as TApiModule[];
const optional = async <T,>(request: Promise<T>, fallback: T): Promise<T> => request.catch(() => fallback);

export const lmsApi = {
  me: async (): Promise<{ cohorts: TLmsCohort[]; activeCohortId: string | null }> => {
    const { role, cohorts, activeCohortId } = (await axiosInstance.get("/lms/me")).data as { role: TLmsCohort["role"]; cohorts: TApiCohort[]; activeCohortId: string | null };
    return { cohorts: cohorts.map((cohort) => mapCohort(cohort, role)), activeCohortId };
  },

  dashboard: async (cohortId?: string): Promise<TApiDashboard> => {
    const { data } = await axiosInstance.get("/lms/dashboard/student", { params: cohortParams(cohortId) });
    return {
      cohort: { trimester: { name: data.cohort.name, programName: data.cohort.programTitle } },
      currentWeek: data.cohort.currentWeek,
      progress: {
        overall: data.progress.overall,
        week: { weekNumber: data.cohort.currentWeek, percent: data.progress.week },
        assignments: data.progress.assignments,
        attendance: { attended: 0, total: 0, percent: typeof data.progress.attendance === "number" ? data.progress.attendance : null },
      },
      upNext: data.upNext ? { kind: "video", label: "Next lesson", title: data.upNext.title, module: `Week ${data.cohort.currentWeek}`, labSlug: null } : null,
      upcoming: (data.upcoming ?? []).map((entry: { title: string; type: string; dueAt: string }) => ({ type: entry.type === "assignment" ? "problems" : entry.type, title: entry.title, detail: "", dueAt: entry.dueAt })),
      announcements: (data.announcements ?? []).map((entry: { title: string; message: string; createdAt: string }) => ({ title: entry.title, text: entry.message, createdAt: entry.createdAt })),
    };
  },

  curriculum: async (cohortId?: string): Promise<{ cohort: TLmsCohort; currentWeek: number; weeks: { weekNumber: number; title: string; progress: number; estimatedHours: number }[] }> => {
    const cohort = await cohortFor(cohortId);
    const modules = await modulesOf(cohort._id);
    const me = (await axiosInstance.get("/lms/me")).data.cohorts.find((item: TApiCohort) => item._id === cohort._id);
    return {
      cohort,
      currentWeek: me?.currentWeek ?? 1,
      weeks: modules.map((module, index) => {
        const done = module.lessons.filter((lesson) => lesson.completed).length;
        return { weekNumber: index + 1, title: module.title, progress: module.lessons.length ? Math.round((done / module.lessons.length) * 100) : 0, estimatedHours: Math.round((module.lessons.reduce((sum, lesson) => sum + minutesOf(lesson.duration), 0) / 60) * 10) / 10 };
      }),
    };
  },
  week: async (weekNumber: number, cohortId?: string): Promise<{ cohort: TLmsCohort; trimester: string; programName: string; week: TApiWeek }> => {
    const cohort = await cohortFor(cohortId);
    const [modules, assignments, labs, sessions] = await Promise.all([
      modulesOf(cohort._id),
      optional(axiosInstance.get("/lms/assignments", { params: { cohortId: cohort._id } }).then((r) => (r.data.assignments ?? []) as TApiAssignment[]), []),
      optional(axiosInstance.get(`/lms/cohorts/${cohort._id}/labs`).then((r) => (r.data.labs ?? []) as TApiLabSummary[]), []),
      optional(axiosInstance.get("/lms/live-sessions", { params: { cohortId: cohort._id } }).then((r) => (r.data.sessions ?? []) as TApiSession[]), []),
    ]);
    return { cohort, trimester: cohort.trimester.name, programName: cohort.trimester.programName, week: buildWeek(weekNumber, modules, cohort, assignments, labs, sessions) };
  },
  // Only lessons carry progress. The other cards (labs, classes, assignments, quizzes) complete through their own screens.
  setProgress: async (itemId: string, done: boolean, cohortId?: string) => {
    if (itemId.startsWith("x:")) return null;
    return (await axiosInstance.put(`/lms/lessons/${itemId}/progress`, { cohortId, isCompleted: done })).data;
  },

  liveSessions: async (cohortId?: string): Promise<TLiveSession[]> => {
    const { data } = await axiosInstance.get("/lms/live-sessions", { params: cohortParams(cohortId) });
    return (data.sessions as TApiSession[]).map((session) => ({
      _id: session._id,
      title: session.title,
      cohortId: typeof session.cohortId === "object" ? session.cohortId._id : session.cohortId,
      instructor: { _id: typeof session.instructorId === "object" ? session.instructorId._id : String(session.instructorId ?? ""), name: hostName(session.instructorId) },
      startsAt: session.startsAt,
      endsAt: session.endsAt,
      status: session.status,
      canJoin: canJoinNow(session),
    }));
  },
  liveSession: async (id: string): Promise<TLiveSession> => {
    const { session, polls } = (await axiosInstance.get(`/lms/live-sessions/${id}`)).data as { session: TLiveSession & { instructor: { _id: string; name: string } | null }; polls: (Omit<TLivePoll, "isOpen"> & { status: string })[] };
    return { ...session, instructor: session.instructor ?? "Tutor", canJoin: canJoinNow(session), polls: polls.map(({ status, ...poll }) => ({ ...poll, isOpen: status === "open" })) };
  },
  // Enter the video room: the server issues LiveKit credentials and records attendance
  join: async (id: string): Promise<TRoomCredentials> => (await axiosInstance.post(`/lms/live-sessions/${id}/join`)).data,
  leave: async (id: string) => (await axiosInstance.post(`/lms/live-sessions/${id}/leave`)).data,
  startSession: async (id: string) => (await axiosInstance.put(`/lms/live-sessions/${id}`, { status: "live" })).data,
  endSession: async (id: string) => (await axiosInstance.put(`/lms/live-sessions/${id}`, { status: "ended" })).data,
  chat: async (id: string): Promise<TLiveMessage[]> => {
    const { messages } = (await axiosInstance.get(`/lms/live-sessions/${id}/chat`, { params: { limit: 100 } })).data as { messages: { _id: string; authorId: string; authorName: string; text: string; createdAt: string }[] };
    return messages.map((message) => ({ _id: message._id, system: false, text: message.text, author: { _id: message.authorId, name: message.authorName }, createdAt: message.createdAt }));
  },
  vote: async (pollId: string, option: number) => (await axiosInstance.post(`/lms/polls/${pollId}/votes`, { optionIndex: option })).data,
  createPoll: async (id: string, question: string, options: string[]) => (await axiosInstance.post(`/lms/live-sessions/${id}/polls`, { question, options })).data,
  closePoll: async (pollId: string) => (await axiosInstance.post(`/lms/polls/${pollId}/close`)).data,

  inquiries: async (): Promise<TApiInquiry[]> => (await axiosInstance.get("/lms/inquiries")).data.inquiries,
  createInquiry: async (body: { category: string; subject: string; description: string; attachments?: TAttachment[] }) => (await axiosInstance.post("/lms/inquiries", body)).data,

  labs: async (cohortId?: string): Promise<TApiLabSummary[]> => {
    const cohort = await cohortFor(cohortId);
    return (await axiosInstance.get(`/lms/cohorts/${cohort._id}/labs`)).data.labs;
  },
  lab: async (labId: string): Promise<TApiLabDetail> => (await axiosInstance.get(`/lms/labs/${labId}`)).data,
  autosaveLab: async (labId: string, code: string) => (await axiosInstance.put(`/lms/labs/${labId}/autosave`, { code })).data as { saved: boolean; lastAutosavedAt: string },
  submitLab: async (labId: string, code: string, passedTests: number, totalTests: number) => (await axiosInstance.post(`/lms/labs/${labId}/submit`, { code, passedTests, totalTests })).data,
};

export type TAttachment = { key: string; name: string; size: number; mimeType: string };

/** Uploads a help-center attachment straight to S3 (documents folder) and returns what the inquiry endpoint expects. */
export async function uploadAttachment(file: File): Promise<TAttachment> {
  const { uploadUrl, key } = await getPresignedUrl(file, "documents");
  await axios.put(uploadUrl, file, { headers: { "Content-Type": file.type } });
  return { key, name: file.name, size: file.size, mimeType: file.type };
}
