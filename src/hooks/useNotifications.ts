"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationsRead,
  markNotificationsUnread,
  type TNotificationList,
} from "@services/notifications";

const KEY = ["notifications"];

/** One source for notifications: the bell and the notifications page both read from here, so they always agree. */
const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => fetchNotifications(40),
    enabled: isAuthenticated,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  // Update the list straight away, put it back if the server says no
  const optimistic = (change: (list: TNotificationList) => TNotificationList) => {
    const previous = queryClient.getQueryData<TNotificationList>(KEY);
    if (previous) queryClient.setQueryData<TNotificationList>(KEY, change(previous));
    return previous;
  };
  const rollback = (previous?: TNotificationList) => {
    if (previous) queryClient.setQueryData(KEY, previous);
    toast.error("That did not work. Please try again.");
  };

  const setRead = useMutation({
    mutationFn: ({ ids, read }: { ids: string[]; read: boolean }) => (read ? markNotificationsRead(ids) : markNotificationsUnread(ids)),
    onMutate: ({ ids, read }) =>
      optimistic((list) => {
        const items = list.items.map((item) => (ids.includes(item.id) ? { ...item, isRead: read } : item));
        return { ...list, items, unreadCount: Math.max(0, list.unreadCount + (list.items.filter((item) => ids.includes(item.id) && item.isRead !== read).length * (read ? -1 : 1))) };
      }),
    onError: (_error, _vars, previous) => rollback(previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: () => optimistic((list) => ({ ...list, items: list.items.map((item) => ({ ...item, isRead: true })), unreadCount: 0 })),
    onError: (_error, _vars, previous) => rollback(previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: deleteNotification,
    onMutate: (id: string) =>
      optimistic((list) => {
        const target = list.items.find((item) => item.id === id);
        return { ...list, items: list.items.filter((item) => item.id !== id), total: Math.max(0, list.total - 1), unreadCount: target && !target.isRead ? Math.max(0, list.unreadCount - 1) : list.unreadCount };
      }),
    onError: (_error, _vars, previous) => rollback(previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });

  return {
    items: query.data?.items ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    markRead: (ids: string[]) => setRead.mutate({ ids, read: true }),
    markUnread: (ids: string[]) => setRead.mutate({ ids, read: false }),
    markAllRead: () => markAll.mutate(),
    remove: (id: string) => remove.mutate(id),
    isMarkingAll: markAll.isPending,
  };
};

export default useNotifications;
