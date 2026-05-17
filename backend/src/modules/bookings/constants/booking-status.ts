export const bookingStatuses = [
  "pending",
  "confirmed",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type BookingStatusType = (typeof bookingStatuses)[number];
