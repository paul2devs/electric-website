import { PrismaService } from "../../prisma/prisma.service";
import { AvailabilityService } from "../availability/availability.service";
import { EventsService } from "../events/events.service";
import { PricingService } from "../pricing/pricing.service";
import type { SafeUser } from "../users/users.service";
import { type BookingStatusType } from "./constants/booking-status";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { RescheduleBookingDto } from "./dto/reschedule-booking.dto";
export type BookingResponse = {
    id: string;
    serviceId: string;
    serviceName?: string;
    userId: string;
    date: string;
    time: string;
    status: BookingStatusType;
    address: string;
    phone: string;
    notes: string | null;
    addOnIds: string[];
    distanceKm: number;
    price: number;
    pricing: {
        base: number;
        urgency: number;
        distance: number;
        addons: number;
        total: number;
    };
    createdAt: string;
};
export declare class BookingsService {
    private readonly prisma;
    private readonly availabilityService;
    private readonly pricingService;
    private readonly eventsService;
    constructor(prisma: PrismaService, availabilityService: AvailabilityService, pricingService: PricingService, eventsService: EventsService);
    createBooking(user: SafeUser, dto: CreateBookingDto): Promise<BookingResponse>;
    listForUser(userId: string): Promise<BookingResponse[]>;
    getForUser(userId: string, bookingId: string): Promise<BookingResponse>;
    cancelForUser(userId: string, bookingId: string): Promise<BookingResponse>;
    rescheduleForUser(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponse>;
    updateStatus(bookingId: string, status: BookingStatusType, actor: SafeUser): Promise<BookingResponse>;
    private toResponse;
}
