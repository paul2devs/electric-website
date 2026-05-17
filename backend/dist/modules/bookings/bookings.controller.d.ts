import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { BookingsService, type BookingResponse } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { RescheduleBookingDto } from "./dto/reschedule-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: AuthRequest, dto: CreateBookingDto): Promise<BookingResponse>;
    list(req: AuthRequest): Promise<BookingResponse[]>;
    cancel(req: AuthRequest, id: string): Promise<BookingResponse>;
    reschedule(req: AuthRequest, id: string, dto: RescheduleBookingDto): Promise<BookingResponse>;
    detail(req: AuthRequest, id: string): Promise<BookingResponse>;
    updateStatus(req: AuthRequest, id: string, dto: UpdateBookingStatusDto): Promise<BookingResponse>;
}
