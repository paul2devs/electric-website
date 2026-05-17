export declare const bookingStatuses: readonly ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled"];
export type BookingStatusType = (typeof bookingStatuses)[number];
