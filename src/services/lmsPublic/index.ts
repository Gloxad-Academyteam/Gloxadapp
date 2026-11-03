import axiosInstance from "@utils/axiosInstance";

export type TEnrolmentState = "upcoming" | "open" | "closed";

export type TPublicTrimester = {
  id: string;
  name: string;
  programName: string;
  startsAt: string;
  endsAt: string;
  enrollmentOpensAt: string | null;
  enrollmentClosesAt: string | null;
  price: number;
  currency: "NGN" | "USD";
  status: "open" | "running" | "ended";
  enrolmentState: TEnrolmentState;
  enrolled: boolean;
};

export type TPublicWeek = { weekNumber: number; title: string; text: string; estimatedHours: number; concepts: string[] };

export type TApplicationStatus = "draft" | "submitted" | "under_review" | "shortlisted" | "approved" | "rejected" | "withdrawn" | "closed";

export type TPublicScholarship = {
  id: string;
  title: string;
  summary: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  opensAt: string;
  closesAt: string;
  state: TEnrolmentState;
  application: { id: string; status: TApplicationStatus; submittedAt: string; latest: { status: TApplicationStatus; note: string; at: string } | null } | null;
};

export const lmsPublicApi = {
  trimesters: async (): Promise<TPublicTrimester[]> => (await axiosInstance.get("/lms/public/trimesters")).data.trimesters,
  trimester: async (id: string): Promise<{ trimester: TPublicTrimester; weeks: TPublicWeek[] }> => (await axiosInstance.get(`/lms/public/trimesters/${id}`)).data,
  enrol: async (id: string): Promise<{ message: string; cohortId: string }> => (await axiosInstance.post(`/lms/trimesters/${id}/enrol`)).data,
  scholarships: async (): Promise<TPublicScholarship[]> => (await axiosInstance.get("/lms/public/scholarships")).data.scholarships,
  apply: async (id: string, body: { statement: string }) => (await axiosInstance.post(`/lms/scholarships/${id}/apply`, body)).data,
};

export const errorMessage = (error: unknown, fallback = "Something went wrong. Please try again."): string =>
  (error as { response?: { data?: { error?: string } } })?.response?.data?.error || fallback;
