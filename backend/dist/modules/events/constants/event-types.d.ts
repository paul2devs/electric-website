export declare const domainEventTypes: {
    readonly BOOKING_CREATED: "BOOKING_CREATED";
    readonly BOOKING_RESCHEDULED: "BOOKING_RESCHEDULED";
    readonly BOOKING_CONFIRMED: "BOOKING_CONFIRMED";
    readonly TECHNICIAN_ASSIGNED: "TECHNICIAN_ASSIGNED";
    readonly BOOKING_STARTED: "BOOKING_STARTED";
    readonly BOOKING_COMPLETED: "BOOKING_COMPLETED";
    readonly BOOKING_CANCELLED: "BOOKING_CANCELLED";
};
export type DomainEventType = (typeof domainEventTypes)[keyof typeof domainEventTypes];
