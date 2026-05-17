import { NotificationsQueue } from "./notifications.queue";
import type { BookingEventPayload } from "./types/domain-event-payloads";
export declare class NotificationsEventsHandler {
    private readonly notificationsQueue;
    constructor(notificationsQueue: NotificationsQueue);
    onBookingCreated(payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
    onBookingRescheduled(payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
    onBookingConfirmed(payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
    onTechnicianAssigned(payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
    onBookingStarted(payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
    onBookingCompleted(payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
    onBookingCancelled(payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
}
