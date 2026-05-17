import { ApiError } from "@/lib/api/errors";
import { authMe, fetchWithAuth, readErrorMessage } from "@/lib/auth/auth-api";

import type { DashboardBooking, DashboardInvoice, DashboardStats } from "./types";

export async function fetchDashboardBookings(): Promise<DashboardBooking[]> {
  const res = await fetchWithAuth("/bookings", { method: "GET" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<DashboardBooking[]>;
}

export async function fetchDashboardBooking(id: string): Promise<DashboardBooking> {
  const res = await fetchWithAuth(`/bookings/${id}`, { method: "GET" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<DashboardBooking>;
}

export async function cancelDashboardBooking(id: string): Promise<DashboardBooking> {
  const res = await fetchWithAuth(`/bookings/${id}/cancel`, { method: "POST" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<DashboardBooking>;
}

export async function rescheduleDashboardBooking(
  id: string,
  payload: {
    date: string;
    time: string;
    lockToken: string;
    quotedTotal: number;
  },
): Promise<DashboardBooking> {
  const res = await fetchWithAuth(`/bookings/${id}/reschedule`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<DashboardBooking>;
}

export async function fetchDashboardInvoices(): Promise<DashboardInvoice[]> {
  const res = await fetchWithAuth("/invoices", { method: "GET" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<DashboardInvoice[]>;
}

export async function fetchDashboardInvoice(id: string): Promise<DashboardInvoice> {
  const res = await fetchWithAuth(`/invoices/${id}`, { method: "GET" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<DashboardInvoice>;
}

export async function fetchDashboardProfile() {
  const res = await fetchWithAuth("/user/profile", { method: "GET" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as ReturnType<typeof authMe>;
}

export async function updateDashboardProfile(input: {
  name?: string;
  phone?: string;
  address?: string;
}) {
  const res = await fetchWithAuth("/user/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as ReturnType<typeof authMe>;
}

export async function updateDashboardPassword(input: {
  currentPassword: string;
  nextPassword: string;
}): Promise<void> {
  const res = await fetchWithAuth("/user/password", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok && res.status !== 204) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
}

export function buildStats(bookings: DashboardBooking[]): DashboardStats {
  const now = new Date();
  const totalBookings = bookings.length;
  const completedServices = bookings.filter((booking) => booking.status === "completed").length;
  const upcomingJobs = bookings.filter((booking) => {
    const date = new Date(`${booking.date}T${booking.time}:00.000Z`);
    return date.getTime() > now.getTime() && booking.status !== "cancelled";
  }).length;
  const totalSpent = bookings.reduce((sum, booking) => {
    if (booking.status === "cancelled") {
      return sum;
    }
    return sum + booking.pricing.total;
  }, 0);

  return {
    totalBookings,
    completedServices,
    upcomingJobs,
    totalSpent,
  };
}
