import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export async function getDashboardStats(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/dashboard-stats");
  return { data };
}
