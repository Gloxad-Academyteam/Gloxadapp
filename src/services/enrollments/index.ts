import axiosInstance from "@utils/axiosInstance";

// GET /enrollments/my-courses answers { enrollments, pagination }. Accept a plain list too, so callers
// always get an array.
const toList = (data: any): any[] =>
  Array.isArray(data) ? data : Array.isArray(data?.enrollments) ? data.enrollments : [];

export async function getMyEnrollments(): Promise<any[]> {
  const response = await axiosInstance.get("/enrollments/my-courses", { params: { limit: 100 } });
  return toList(response.data);
}

// The learner's enrolment in one course, matched by course id or slug. null when they are not enrolled.
export async function getMyEnrollment(courseId: string): Promise<any | null> {
  const list = await getMyEnrollments();
  return list.find((e) => e.course?._id === courseId || e.course?.slug === courseId || e.course === courseId) ?? null;
}

// Free enrolment. Answers 200 when the learner is already enrolled, so it is safe to call again.
export async function enrollInFreeCourse(courseId: string) {
  const response = await axiosInstance.post(`/enrollments/enroll/${courseId}`);
  return response.data;
}

// Saves where the learner is. Pass completed: true to mark the lesson finished.
export async function saveLessonProgress(
  courseId: string,
  { lessonId, completed, playbackPosition }: { lessonId: string; completed?: boolean; playbackPosition?: number }
) {
  const response = await axiosInstance.post(`/learning/${courseId}/progress`, {
    lessonId,
    ...(completed ? { isCompleted: true } : {}),
    ...(playbackPosition !== undefined ? { playbackPosition } : {}),
  });
  return response.data;
}

export type TCourseProgress = { completed: number; total: number; percent: number };

// Progress through one course, from the enrolment's completed lessons and the course's own lesson list.
export function getCourseProgress(enrollment: any, course: any): TCourseProgress {
  const lessonIds: string[] = (course?.modules || []).flatMap((mod: any) => (mod.lessons || []).map((l: any) => String(l._id)));
  const done = new Set((enrollment?.completedLessons || []).map(String));
  const completed = lessonIds.filter((id) => done.has(id)).length;
  const total = lessonIds.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : Number(enrollment?.progressPercentage) || 0;
  return { completed, total, percent };
}

// Module order for self-paced courses: lessons, then the module quiz, then the module task, then the next module.
// The server decides what is open; these calls only read it and send the learner's work.
export type TModuleGate = {
  moduleId: string;
  index: number;
  unlocked: boolean;
  complete: boolean;
  stage: "locked" | "lessons" | "quiz" | "task" | "complete";
  lessons: { total: number; done: number };
  quiz: { count: number; quizId: string; passed: boolean; bestScore: number | null; attempts: number; available: boolean } | null;
  task: { submitted: boolean; submittedAt: string | null; attempts: number; minWords: number; available: boolean } | null;
};

export type TTaskSubmission = { _id: string; text: string; link: string; wordCount: number; attempt: number; submittedAt: string };

export type TModuleTask = {
  task: { moduleId: string; title: string; instructions: string; minWords: number };
  gate: TModuleGate;
  submissions: TTaskSubmission[];
};

export async function getModuleGates(courseId: string): Promise<TModuleGate[]> {
  const response = await axiosInstance.get(`/learning/${courseId}/modules`);
  return response.data.modules ?? [];
}

export async function getModuleTask(courseId: string, moduleId: string): Promise<TModuleTask> {
  const response = await axiosInstance.get(`/learning/${courseId}/modules/${moduleId}/task`);
  return response.data;
}

export async function submitModuleTask(courseId: string, moduleId: string, body: { text: string; link?: string }) {
  const response = await axiosInstance.post(`/learning/${courseId}/modules/${moduleId}/task`, body);
  return response.data as { message: string; submission: TTaskSubmission; gate: TModuleGate; progressPercentage: number; isCompleted: boolean };
}

// What a learner has done, out of what the course asks for. Quizzes and tasks count only on courses that go module by module.
export function getModuleProgress(course: any, completedLessonIds: Set<string>, gates: TModuleGate[] | undefined): TCourseProgress {
  const lessons = (course?.modules || []).flatMap((mod: any) => mod.lessons || []);
  const lessonsDone = lessons.filter((l: any) => completedLessonIds.has(String(l._id))).length;
  let total = lessons.length;
  let done = lessonsDone;
  if (course?.sequentialModules) {
    (gates || []).forEach((gate) => {
      if (gate.quiz) {
        total += gate.quiz.count;
        done += gate.quiz.passed ? gate.quiz.count : 0;
      }
      if (gate.task) {
        total += 1;
        done += gate.task.submitted ? 1 : 0;
      }
    });
  }
  return { completed: lessonsDone, total: lessons.length, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}
