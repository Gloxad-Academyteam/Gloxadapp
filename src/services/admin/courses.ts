import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export async function getPendingCourses(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/courses/pending");
  return { data };
}

export async function getAllAdminCourses(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/courses/all");
  return { data };
}

export async function updateCourseStatus(courseId: string, payload: { status: string; rejectionReason?: string }): Promise<TService<any>> {
  const { data } = await axiosInstance.put(`/admin/courses/${courseId}/status`, payload);
  return { data };
}

export async function getAppeals(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/appeals");
  return { data };
}

export async function resolveAppeal(appealId: string, payload: { status: string; adminNotes: string; publishCourse?: boolean }): Promise<TService<any>> {
  const { data } = await axiosInstance.put(`/admin/appeals/${appealId}/status`, payload);
  return { data };
}

export async function getAdminCourseDetails(courseId: string): Promise<TService<any>> {
  const { data } = await axiosInstance.get(`/admin/courses/${courseId}`);
  return { data };
}
