import { ApiError } from "@/lib/api/errors";
import { fetchWithAuth, readErrorMessage } from "@/lib/auth/auth-api";

import type { AppNotification } from "./types";

export async function fetchNotifications(): Promise<{
  items: AppNotification[];
  unreadCount: number;
}> {
  const res = await fetchWithAuth("/notifications", { method: "GET" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<{ items: AppNotification[]; unreadCount: number }>;
}

export async function markNotificationRead(id: string, read: boolean): Promise<AppNotification> {
  const res = await fetchWithAuth(`/notifications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ read }),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<AppNotification>;
}
