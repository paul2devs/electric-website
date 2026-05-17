import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { TechniciansService } from "../technicians/technicians.service";
import { AdminAssignTechnicianDto } from "./dto/admin-assign-technician.dto";
import { AdminServiceUpsertDto } from "./dto/admin-service-upsert.dto";
import { AdminUpdateBookingDto } from "./dto/admin-update-booking.dto";
export declare class AdminService {
    private readonly prisma;
    private readonly techniciansService;
    private readonly eventsService;
    constructor(prisma: PrismaService, techniciansService: TechniciansService, eventsService: EventsService);
    overview(): Promise<{
        metrics: {
            totalRevenue: number;
            totalBookings: number;
            pendingJobs: number;
            completedJobs: number;
            activeTechnicians: number;
        };
        activity: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            serviceId: string;
        }[];
    }>;
    listBookings(): Promise<({
        user: {
            name: string;
            phone: string | null;
            address: string | null;
            id: string;
            email: string;
            password: string;
            role: string;
            isBlocked: boolean;
            createdAt: Date;
        };
        service: {
            name: string;
            id: string;
            createdAt: Date;
            slug: string | null;
            imageUrl: string | null;
            category: string;
            basePrice: number;
            duration: number;
            pricingType: string;
        };
        technician: {
            name: string;
            phone: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.TechnicianStatus;
            skills: string[];
        } | null;
    } & {
        phone: string;
        address: string;
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        date: Date;
        time: string;
        serviceId: string;
        technicianId: string | null;
        notes: string | null;
        addOnIds: string[];
        baseAmount: number;
        urgencyFee: number;
        distanceFee: number;
        addonsFee: number;
        distanceKm: number;
        price: number;
    })[]>;
    getBooking(id: string): Promise<{
        user: {
            name: string;
            phone: string | null;
            address: string | null;
            id: string;
            email: string;
            password: string;
            role: string;
            isBlocked: boolean;
            createdAt: Date;
        };
        service: {
            name: string;
            id: string;
            createdAt: Date;
            slug: string | null;
            imageUrl: string | null;
            category: string;
            basePrice: number;
            duration: number;
            pricingType: string;
        };
        technician: {
            name: string;
            phone: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.TechnicianStatus;
            skills: string[];
        } | null;
    } & {
        phone: string;
        address: string;
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        date: Date;
        time: string;
        serviceId: string;
        technicianId: string | null;
        notes: string | null;
        addOnIds: string[];
        baseAmount: number;
        urgencyFee: number;
        distanceFee: number;
        addonsFee: number;
        distanceKm: number;
        price: number;
    }>;
    updateBooking(id: string, dto: AdminUpdateBookingDto): Promise<{
        technician: {
            name: string;
            phone: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.TechnicianStatus;
            skills: string[];
        } | null;
    } & {
        phone: string;
        address: string;
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        date: Date;
        time: string;
        serviceId: string;
        technicianId: string | null;
        notes: string | null;
        addOnIds: string[];
        baseAmount: number;
        urgencyFee: number;
        distanceFee: number;
        addonsFee: number;
        distanceKm: number;
        price: number;
    }>;
    assignTechnician(dto: AdminAssignTechnicianDto): Promise<{
        technician: {
            name: string;
            phone: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.TechnicianStatus;
            skills: string[];
        } | null;
    } & {
        phone: string;
        address: string;
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        date: Date;
        time: string;
        serviceId: string;
        technicianId: string | null;
        notes: string | null;
        addOnIds: string[];
        baseAmount: number;
        urgencyFee: number;
        distanceFee: number;
        addonsFee: number;
        distanceKm: number;
        price: number;
    }>;
    listServices(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        slug: string | null;
        imageUrl: string | null;
        category: string;
        basePrice: number;
        duration: number;
        pricingType: string;
    }[]>;
    createService(dto: AdminServiceUpsertDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        slug: string | null;
        imageUrl: string | null;
        category: string;
        basePrice: number;
        duration: number;
        pricingType: string;
    }>;
    updateService(id: string, dto: AdminServiceUpsertDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        slug: string | null;
        imageUrl: string | null;
        category: string;
        basePrice: number;
        duration: number;
        pricingType: string;
    }>;
    deleteService(id: string): Promise<void>;
    listUsers(): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        address: string | null;
        role: string;
        isBlocked: boolean;
        createdAt: string;
        bookingsCount: number;
    }[]>;
    blockUser(userId: string, block: boolean): Promise<{
        name: string;
        phone: string | null;
        address: string | null;
        id: string;
        email: string;
        password: string;
        role: string;
        isBlocked: boolean;
        createdAt: Date;
    }>;
    analytics(): Promise<{
        totalRevenue: number;
        monthlyRevenue: {
            month: string;
            value: number;
        }[];
        popularServices: {
            serviceId: string;
            name: string;
            count: number;
        }[];
        peakBookingTimes: {
            time: string;
            count: number;
        }[];
    }>;
}
