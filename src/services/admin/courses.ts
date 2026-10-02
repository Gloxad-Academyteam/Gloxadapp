import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

type TListParams = { page?: number; limit?: number; search?: string };

export async function getPendingCourses(params?: TListParams): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/courses/pending", { params });
  return { data };
}

// The API caps `limit` at 50 per page
export async function getAllAdminCourses(params: TListParams = { limit: 50 }): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/courses/all", { params });
  return { data };
}

export async function updateCourseStatus(courseId: string, payload: { status: string; rejectionReason?: string }): Promise<TService<any>> {
  const { data } = await axiosInstance.put(`/admin/courses/${courseId}/status`, payload);
  return { data };
}

export async function getAppeals(params?: TListParams & { status?: "pending" | "resolved" | "dismissed" }): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/appeals", { params });
  return { data };
}

export async function resolveAppeal(appealId: string, payload: { status: "resolved" | "dismissed"; resolutionNotes: string }): Promise<TService<any>> {
  const { data } = await axiosInstance.put(`/admin/appeals/${appealId}/status`, payload);
  return { data };
}

export async function getAdminCourseDetails(courseId: string): Promise<TService<any>> {
  try {
    const { data } = await axiosInstance.get(`/admin/courses/${courseId}`);
    return { data };
  } catch (error: any) {
    // Not in the API reference: fall back to the public course endpoint
    if (error?.response?.status !== 404) throw error;
    const { data } = await axiosInstance.get(`/courses/${courseId}`);
    return { data };
  }
}
