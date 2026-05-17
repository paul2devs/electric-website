import { ApiError } from "@/lib/api/errors";
import { fetchWithAuth, readErrorMessage } from "@/lib/auth/auth-api";

import { enrichBackendServices, type EnrichedBackendService } from "@/lib/services/service-media";

import type { BackendService, BookingResult, PricingResult } from "./types";

export async function fetchServices(): Promise<EnrichedBackendService[]> {
  const res = await fetchWithAuth("/services", { method: "GET" });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  const payload = (await res.json()) as BackendService[];
  return enrichBackendServices(payload);
}

export async function fetchAvailability(
  serviceId: string,
  date: string,
): Promise<string[]> {
  const params = new URLSearchParams({ serviceId, date });
  const res = await fetchWithAuth(`/availability?${params.toString()}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  const payload = (await res.json()) as { slots: string[] };
  return payload.slots;
}

export async function lockSlot(input: {
  serviceId: string;
  date: string;
  time: string;
}): Promise<{ lockToken: string; expiresInSeconds: number }> {
  const res = await fetchWithAuth("/availability/lock", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<{ lockToken: string; expiresInSeconds: number }>;
}

export async function unlockSlot(input: {
  serviceId: string;
  date: string;
  time: string;
  lockToken: string;
}): Promise<void> {
  const res = await fetchWithAuth("/availability/unlock", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok && res.status !== 204) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
}

export async function calculatePricing(input: {
  serviceId: string;
  date?: string;
  time?: string;
  address?: string;
  mockDistanceKm?: number;
  addOnIds?: string[];
}): Promise<PricingResult> {
  const res = await fetchWithAuth("/pricing/calculate", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<PricingResult>;
}

export async function createBooking(input: {
  serviceId: string;
  date: string;
  time: string;
  lockToken: string;
  phone: string;
  address: string;
  notes?: string;
  addOnIds: string[];
  mockDistanceKm: number;
  quotedTotal: number;
}): Promise<BookingResult> {
  const res = await fetchWithAuth("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  return res.json() as Promise<BookingResult>;
}
