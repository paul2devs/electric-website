import { CreateTechnicianDto } from "../technicians/dto/create-technician.dto";
import { UpdateTechnicianDto } from "../technicians/dto/update-technician.dto";
import { TechniciansService } from "../technicians/technicians.service";
import { FeedbackStatus } from "@prisma/client";
import { UpdateFeedbackStatusDto } from "../feedback/dto/update-feedback-status.dto";
import { FeedbackService } from "../feedback/feedback.service";
import { AdminAssignTechnicianDto } from "./dto/admin-assign-technician.dto";
import { AdminServiceUpsertDto } from "./dto/admin-service-upsert.dto";
import { AdminUpdateBookingDto } from "./dto/admin-update-booking.dto";
import { AdminService } from "./admin.service";
export declare class AdminController {
    private readonly adminService;
    private readonly techniciansService;
    private readonly feedbackService;
    constructor(adminService: AdminService, techniciansService: TechniciansService, feedbackService: FeedbackService);
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
    bookings(): Promise<({
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
    bookingDetail(id: string): Promise<{
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
    services(): Promise<{
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
    users(): Promise<{
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
    blockUser(id: string, block: string): Promise<{
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
    technicians(): Promise<import("../technicians/technicians.service").TechnicianWithStats[]>;
    createTechnician(dto: CreateTechnicianDto): Promise<{
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TechnicianStatus;
        skills: string[];
    }>;
    updateTechnician(id: string, dto: UpdateTechnicianDto): Promise<{
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TechnicianStatus;
        skills: string[];
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
    feedback(status?: FeedbackStatus): Promise<({
        user: {
            name: string;
            phone: string | null;
            id: string;
            email: string;
        } | null;
    } & {
        name: string | null;
        message: string;
        id: string;
        email: string | null;
        createdAt: Date;
        userId: string | null;
        status: import(".prisma/client").$Enums.FeedbackStatus;
    })[]>;
    updateFeedbackStatus(id: string, dto: UpdateFeedbackStatusDto): Promise<{
        name: string | null;
        message: string;
        id: string;
        email: string | null;
        createdAt: Date;
        userId: string | null;
        status: import(".prisma/client").$Enums.FeedbackStatus;
    }>;
}
