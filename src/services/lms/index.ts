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

export type TLiveSession = {
  _id: string;
  title: string;
  instructor: { _id: string; name: string } | string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "live" | "ended" | "cancelled";
  canJoin: boolean;
  handsRaised: number;
  hasStream: boolean;
  sharedCode?: { language: string; content: string; updatedAt: string | null } | null;
  polls?: TLivePoll[];
  myHandRaised?: boolean;
};
export type TLivePoll = { _id: string; question: string; isOpen: boolean; options: { index: number; text: string; votes: number }[]; totalVotes: number; myVote: number | null };
export type TLiveMessage = { _id: string; system: boolean; text: string; author: { _id: string; name: string } | null; createdAt: string };
export type TLivePerson = { _id: string; name: string; role: string; joined: boolean; handRaised: boolean; isYou: boolean };
export type TStream = { provider: "youtube"; configured: boolean; videoId: string | null; embedUrl: string | null; watchUrl: string | null; role: string; status: string };

export type TApiInquiry = { _id: string; reference: string; category: "academics" | "technical" | "billing"; subject: string; description?: string; status: "pending" | "in_progress" | "resolved"; createdAt: string };

export type TApiLab = { slug: string; title: string; module: string; estimate: string; submitted: boolean; best: { passed: number; total: number } | null };

const cohortParams = (cohortId?: string) => (cohortId ? { cohortId } : {});

export const lmsApi = {
  me: async (): Promise<{ cohorts: TLmsCohort[]; activeCohortId: string | null }> => (await axiosInstance.get("/lms/me")).data,
  curriculum: async (cohortId?: string): Promise<{ cohort: TLmsCohort; currentWeek: number; weeks: { weekNumber: number; title: string; progress: number; estimatedHours: number }[] }> =>
    (await axiosInstance.get("/lms/curriculum", { params: cohortParams(cohortId) })).data,
  week: async (weekNumber: number, cohortId?: string): Promise<{ cohort: TLmsCohort; trimester: string; programName: string; week: TApiWeek }> =>
    (await axiosInstance.get(`/lms/curriculum/weeks/${weekNumber}`, { params: cohortParams(cohortId) })).data,

  liveSessions: async (cohortId?: string): Promise<TLiveSession[]> => (await axiosInstance.get("/lms/live-sessions", { params: cohortParams(cohortId) })).data.sessions,
  liveSession: async (id: string): Promise<TLiveSession> => (await axiosInstance.get(`/lms/live-sessions/${id}`)).data.session,
  join: async (id: string): Promise<TStream> => (await axiosInstance.post(`/lms/live-sessions/${id}/join`)).data,
  setStream: async (id: string, youtubeUrl: string) => (await axiosInstance.put(`/lms/live-sessions/${id}/stream`, { youtubeUrl })).data,
  startSession: async (id: string) => (await axiosInstance.post(`/lms/live-sessions/${id}/start`)).data,
  endSession: async (id: string) => (await axiosInstance.post(`/lms/live-sessions/${id}/end`)).data,
  chat: async (id: string): Promise<TLiveMessage[]> => (await axiosInstance.get(`/lms/live-sessions/${id}/chat`, { params: { limit: 100 } })).data.messages,
  sendChat: async (id: string, text: string): Promise<TLiveMessage> => (await axiosInstance.post(`/lms/live-sessions/${id}/chat`, { text })).data.message,
  vote: async (id: string, pollId: string, option: number) => (await axiosInstance.post(`/lms/live-sessions/${id}/polls/${pollId}/vote`, { optionIndex: option })).data,
  createPoll: async (id: string, question: string, options: string[]) => (await axiosInstance.post(`/lms/live-sessions/${id}/polls`, { question, options })).data,
  closePoll: async (id: string, pollId: string) => (await axiosInstance.post(`/lms/live-sessions/${id}/polls/${pollId}/close`)).data,
  updateSharedCode: async (id: string, content: string, language = "javascript") => (await axiosInstance.put(`/lms/live-sessions/${id}/shared-code`, { content, language })).data,
  toggleHand: async (id: string) => (await axiosInstance.post(`/lms/live-sessions/${id}/hand`)).data,
  people: async (id: string): Promise<{ people: TLivePerson[]; total: number }> => (await axiosInstance.get(`/lms/live-sessions/${id}/people`)).data,

  inquiries: async (): Promise<TApiInquiry[]> => (await axiosInstance.get("/lms/inquiries")).data.inquiries,
  createInquiry: async (body: { category: string; subject: string; description: string; attachments?: TAttachment[] }) => (await axiosInstance.post("/lms/inquiries", body)).data,

  labs: async (): Promise<TApiLab[]> => (await axiosInstance.get("/lms/code-labs")).data.labs,
};

export type TAttachment = { key: string; name: string; size: number; mimeType: string };

/** Uploads a help-center attachment straight to S3 (documents folder) and returns what the inquiry endpoint expects. */
export async function uploadAttachment(file: File): Promise<TAttachment> {
  const { uploadUrl, key } = await getPresignedUrl(file, "documents");
  await axios.put(uploadUrl, file, { headers: { "Content-Type": file.type } });
  return { key, name: file.name, size: file.size, mimeType: file.type };
}
