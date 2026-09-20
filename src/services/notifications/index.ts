import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export async function fetchNotifications(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/notifications");
  return { data };
}

export async function markNotificationsAsRead(): Promise<TService<any>> {
  const { data } = await axiosInstance.post("/notifications/mark-read");
  return { data };
}
