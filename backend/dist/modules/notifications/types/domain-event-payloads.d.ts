import type { DomainEventType } from "../../events/constants/event-types";
export type BookingEventPayload = {
    eventType: DomainEventType;
    bookingId: string;
    userId: string;
    serviceName: string;
    date: string;
    time: string;
    address: string;
    status: string;
    technicianName?: string | null;
};
