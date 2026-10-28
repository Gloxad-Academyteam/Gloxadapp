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
