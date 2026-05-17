import { bookingStatuses } from "../constants/booking-status";
export declare class UpdateBookingStatusDto {
    status: (typeof bookingStatuses)[number];
}
