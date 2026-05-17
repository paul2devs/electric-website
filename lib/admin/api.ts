import { ApiError } from "@/lib/api/errors";
import { fetchWithAuth, readErrorMessage } from "@/lib/auth/auth-api";

import type {
  AdminAnalytics,
  AdminBooking,
  AdminFeedback,
  AdminFeedbackStatus,
  AdminOverview,
  AdminServiceRow,
  AdminTechnician,
  AdminUser,
} from "./types";

async function parse<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithAuth(path, init);
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

export function fetchAdminOverview(): Promise<AdminOverview> {
  return parse<AdminOverview>("/admin", { method: "GET" });
}

export function fetchAdminBookings(): Promise<AdminBooking[]> {
  return parse<AdminBooking[]>("/admin/bookings", { method: "GET" });
}

export function fetchAdminBooking(id: string): Promise<AdminBooking> {
  return parse<AdminBooking>(`/admin/bookings/${id}`, { method: "GET" });
}

export function updateAdminBooking(
  id: string,
  payload: { status?: string; technicianId?: string },
): Promise<AdminBooking> {
  return parse<AdminBooking>(`/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function assignAdminTechnician(payload: {
  bookingId: string;
  technicianId?: string;
}): Promise<AdminBooking> {
  return parse<AdminBooking>("/admin/assign-technician", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminServices(): Promise<AdminServiceRow[]> {
  return parse<AdminServiceRow[]>("/admin/services", { method: "GET" });
}

export function createAdminService(payload: {
  name: string;
  slug?: string;
  imageUrl?: string;
  category: string;
  basePrice: number;
  duration: number;
}): Promise<AdminServiceRow> {
  return parse<AdminServiceRow>("/admin/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminService(
  id: string,
  payload: {
    name: string;
    slug?: string;
    imageUrl?: string;
    category: string;
    basePrice: number;
    duration: number;
  },
): Promise<AdminServiceRow> {
  return parse<AdminServiceRow>(`/admin/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminService(id: string): Promise<void> {
  const res = await fetchWithAuth(`/admin/services/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
}

export function fetchAdminUsers(): Promise<AdminUser[]> {
  return parse<AdminUser[]>("/admin/users", { method: "GET" });
}

export function blockAdminUser(id: string, block: boolean): Promise<AdminUser> {
  return parse<AdminUser>(`/admin/users/${id}/block?block=${String(block)}`, {
    method: "PATCH",
  });
}

export function fetchAdminTechnicians(): Promise<AdminTechnician[]> {
  return parse<AdminTechnician[]>("/admin/technicians", { method: "GET" });
}

export function createAdminTechnician(payload: {
  name: string;
  phone: string;
  skills: string[];
  status: "available" | "busy" | "offline";
}): Promise<AdminTechnician> {
  return parse<AdminTechnician>("/admin/technicians", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminTechnician(
  id: string,
  payload: Partial<{
    name: string;
    phone: string;
    skills: string[];
    status: "available" | "busy" | "offline";
  }>,
): Promise<AdminTechnician> {
  return parse<AdminTechnician>(`/admin/technicians/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  return parse<AdminAnalytics>("/admin/analytics", { method: "GET" });
}

export function fetchAdminFeedback(status?: AdminFeedbackStatus): Promise<AdminFeedback[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return parse<AdminFeedback[]>(`/admin/feedback${query}`, { method: "GET" });
}

export function updateAdminFeedbackStatus(
  id: string,
  status: AdminFeedbackStatus,
): Promise<AdminFeedback> {
  return parse<AdminFeedback>(`/admin/feedback/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
