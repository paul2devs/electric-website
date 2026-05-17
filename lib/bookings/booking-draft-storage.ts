import type { BookingDetails, BookingStep } from "@/lib/bookings/types";

const STORAGE_KEY = "testimonydot.booking.draft.v1";

export type BookingDraft = {
  step: BookingStep;
  selectedServiceId: string;
  selectedDate: string;
  selectedTime: string;
  selectedAddOnIds: string[];
  details: BookingDetails;
  inspiredBy?: string;
  projectSlug?: string;
};

export function loadBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as BookingDraft;
  } catch {
    return null;
  }
}

export function saveBookingDraft(draft: BookingDraft): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* quota or private mode */
  }
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
