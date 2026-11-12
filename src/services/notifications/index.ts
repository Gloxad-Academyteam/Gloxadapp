import axiosInstance from "@utils/axiosInstance";

export type TNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
};

export type TNotificationList = { items: TNotification[]; unreadCount: number; total: number; hasMore: boolean };

// The API calls the read flag `read` and the target `link`; older code expected `isRead` and `actionUrl`. Accept either.
const normalise = (raw: any): TNotification => ({
  id: String(raw._id ?? raw.id),
  title: String(raw.title ?? ""),
  message: String(raw.message ?? ""),
  type: String(raw.type ?? "system"),
  isRead: Boolean(raw.read ?? raw.isRead),
  link: raw.link ?? raw.actionUrl ?? null,
  createdAt: raw.createdAt,
});

export async function fetchNotifications(limit = 30): Promise<TNotificationList> {
  const { data } = await axiosInstance.get("/notifications", { params: { limit } });
  const items: TNotification[] = (data.notifications ?? []).map(normalise);
  return {
    items,
    unreadCount: typeof data.unreadCount === "number" ? data.unreadCount : items.filter((item) => !item.isRead).length,
    total: typeof data.total === "number" ? data.total : items.length,
    hasMore: Boolean(data.hasMore),
  };
}

export const markNotificationsRead = (ids: string[]) => axiosInstance.post("/notifications/mark-read", { notificationIds: ids });
export const markAllNotificationsRead = () => axiosInstance.post("/notifications/mark-read", { markAll: true });
export const markNotificationsUnread = (ids: string[]) => axiosInstance.post("/notifications/mark-unread", { notificationIds: ids });
export const deleteNotification = (id: string) => axiosInstance.delete(`/notifications/${id}`);
