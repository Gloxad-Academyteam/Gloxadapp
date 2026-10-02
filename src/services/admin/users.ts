import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export type TUserRole = "student" | "instructor" | "admin";

export async function getUsers(params?: {
  role?: TUserRole;
  status?: "pending" | "approved" | "rejected";
  search?: string;
  page?: number;
  limit?: number;
}): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/users", { params });
  return { data };
}

export async function getRecentRegistrations(limit = 10): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/recent-registrations", { params: { limit } });
  return { data };
}

// Soft delete: the account is deactivated, not removed
export async function deactivateUser(userId: string): Promise<TService<any>> {
  const { data } = await axiosInstance.delete(`/admin/users/${userId}`);
  return { data };
}

export async function updateTutorApproval(
  userId: string,
  payload: { status: "approved" | "rejected"; rejectionReason?: string }
): Promise<TService<any>> {
  const { data } = await axiosInstance.put(`/admin/tutors/${userId}/approval`, payload);
  return { data };
}

export async function sendBroadcast(payload: {
  targetRole: "all" | "student" | "instructor";
  title: string;
  message: string;
}): Promise<TService<any>> {
  const { data } = await axiosInstance.post("/admin/broadcast", payload);
  return { data };
}
