import { BookingStatus } from "@prisma/client";
export declare class AdminUpdateBookingDto {
    status?: BookingStatus;
    technicianId?: string;
}
