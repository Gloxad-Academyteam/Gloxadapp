import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export async function createDraftCourse(payload: { title: string; category?: string; price?: number; courseType?: string }): Promise<TService<any>> {
  const { data } = await axiosInstance.post("/tutor/courses", payload);
  return { data };
}

export async function getTutorCourses(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/tutor/courses");
  return { data };
}

export async function getCourseDetails(courseId: string): Promise<TService<any>> {
  const { data } = await axiosInstance.get(`/tutor/courses/${courseId}`);
  return { data };
}

export async function updateCourse(courseId: string, payload: any): Promise<TService<any>> {
  const { data } = await axiosInstance.put(`/tutor/courses/${courseId}`, payload);
  return { data };
}

export async function submitCourseForReview(courseId: string): Promise<TService<any>> {
  const { data } = await axiosInstance.post(`/tutor/courses/${courseId}/submit`);
  return { data };
}

export async function fileAppeal(courseId: string, payload: { reason: string; evidenceUrl?: string }): Promise<TService<any>> {
  const { data } = await axiosInstance.post(`/tutor/courses/${courseId}/appeal`, payload);
  return { data };
}

export async function searchInstructors(query: string): Promise<TService<any>> {
  const { data } = await axiosInstance.get(`/tutor/search-instructors?q=${query}`);
  return { data };
}
