import axiosInstance from "@utils/axiosInstance";

export type TEnrolmentState = "upcoming" | "open" | "closed";

export type TPublicTrimester = {
  id: string;
  // The Trimester this programme (cohort) belongs to
  trimesterId?: string;
  // Number of weeks in the term, and the landing page content the tutor wrote for the course
  weeks?: number;
  thumbnail?: string | null;
  trailerUrl?: string | null;
  level?: string | null;
  language?: string | null;
  skills?: string[];
  targetAudience?: string[];
  requirements?: string[];
  name: string;
  programName: string;
  description: string;
  seats: number | null;
  seatsLeft: number | null;
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

export type TPublicSession = { id: string; title: string; startsAt: string; endsAt: string };

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

// ---------------------------------------------------------------------------------------------------------------
// The main backend (Units 21 and 25) answers with a Trimester that holds programmes (cohorts), and scholarships with `_id`.
// These types describe those answers; the functions below map them onto the shapes the pages already use, so the pages
// do not change. A "programme" on the page is one cohort, and its id is the cohort id (enrolment is per cohort).
// ---------------------------------------------------------------------------------------------------------------

type TApiProgramme = {
  _id: string;
  trimesterId: string;
  name: string;
  courseId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  seats: number;
  seatsLeft: number;
  instructors: { _id: string; name: string }[];
  enrolled: boolean;
  enrolmentState: TEnrolmentState;
  slug?: string | null;
  thumbnail?: string | null;
  trailerVideoUrl?: string | null;
  level?: string | null;
  language?: string | null;
  skills?: string[];
  targetAudience?: string[];
  requirements?: string[];
  weeks?: { weekNumber: number; title: string; lessonCount: number }[];
  sessions?: { _id: string; title: string; startsAt: string; endsAt: string }[];
};

type TApiTrimester = {
  _id: string;
  number: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  weeks: number;
  enrollmentOpensAt: string | null;
  enrollmentClosesAt: string;
  status: "upcoming" | "active" | "completed";
  programmes: TApiProgramme[];
};

type TApiScholarship = Omit<TPublicScholarship, "id"> & { _id: string };

const toPublicTrimester = (trimester: Omit<TApiTrimester, "programmes">, programme: TApiProgramme): TPublicTrimester => ({
  id: programme._id,
  trimesterId: trimester._id,
  name: trimester.title,
  programName: programme.title,
  description: programme.description || trimester.description,
  seats: programme.seats,
  seatsLeft: programme.seatsLeft,
  startsAt: trimester.startDate,
  endsAt: trimester.endDate,
  enrollmentOpensAt: trimester.enrollmentOpensAt,
  enrollmentClosesAt: trimester.enrollmentClosesAt,
  price: programme.price,
  currency: programme.currency === "USD" ? "USD" : "NGN",
  status: trimester.status === "active" ? "running" : trimester.status === "completed" ? "ended" : "open",
  enrolmentState: programme.enrolmentState,
  enrolled: programme.enrolled,
  weeks: trimester.weeks,
  thumbnail: programme.thumbnail ?? null,
  trailerUrl: programme.trailerVideoUrl ?? null,
  level: programme.level ?? null,
  language: programme.language ?? null,
  skills: programme.skills ?? [],
  targetAudience: programme.targetAudience ?? [],
  requirements: programme.requirements ?? [],
});

export const lmsPublicApi = {
  trimesters: async (): Promise<TPublicTrimester[]> => {
    const { trimesters } = (await axiosInstance.get("/lms/public/trimesters")).data as { trimesters: TApiTrimester[] };
    return trimesters.flatMap((trimester) => trimester.programmes.map((programme) => toPublicTrimester(trimester, programme)));
  },
  // `id` is a programme (cohort) id: the public landing page of one Trimester course
  trimester: async (id: string): Promise<{ trimester: TPublicTrimester; weeks: TPublicWeek[]; sessions: TPublicSession[]; instructors: { name: string }[] }> => {
    const { trimester, programme } = (await axiosInstance.get(`/lms/public/programmes/${id}`)).data as { trimester: Omit<TApiTrimester, "programmes">; programme: TApiProgramme };
    return {
      trimester: toPublicTrimester(trimester, programme),
      weeks: (programme.weeks ?? []).map((week) => ({ weekNumber: week.weekNumber, title: week.title, text: `${week.lessonCount} ${week.lessonCount === 1 ? "lesson" : "lessons"}`, estimatedHours: 0, concepts: [] })),
      sessions: (programme.sessions ?? []).map((session) => ({ id: session._id, title: session.title, startsAt: session.startsAt, endsAt: session.endsAt })),
      instructors: programme.instructors.map((tutor) => ({ name: tutor.name })),
    };
  },
  enrol: async (id: string): Promise<{ message: string; cohortId: string }> => (await axiosInstance.post(`/lms/cohorts/${id}/enrol`)).data,
  scholarships: async (): Promise<TPublicScholarship[]> => {
    const { scholarships } = (await axiosInstance.get("/lms/public/scholarships")).data as { scholarships: TApiScholarship[] };
    return scholarships.map(({ _id, ...rest }) => ({ id: _id, ...rest, application: rest.application ? { ...rest.application, id: (rest.application as unknown as { _id: string })._id } : null }));
  },
  apply: async (id: string, body: { statement: string; documents?: { label: string; key: string }[] }) =>
    (await axiosInstance.post(`/lms/scholarships/${id}/applications`, { statement: body.statement, documents: body.documents ?? [] })).data,
};

export const errorMessage = (error: unknown, fallback = "Something went wrong. Please try again."): string =>
  (error as { response?: { data?: { error?: string } } })?.response?.data?.error || fallback;
