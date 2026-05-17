"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const event_types_1 = require("../events/constants/event-types");
const events_service_1 = require("../events/events.service");
const technicians_service_1 = require("../technicians/technicians.service");
let AdminService = class AdminService {
    prisma;
    techniciansService;
    eventsService;
    constructor(prisma, techniciansService, eventsService) {
        this.prisma = prisma;
        this.techniciansService = techniciansService;
        this.eventsService = eventsService;
    }
    async overview() {
        const [bookings, technicians, invoices] = await Promise.all([
            this.prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
            this.prisma.technician.count({ where: { status: "available" } }),
            this.prisma.invoice.findMany(),
        ]);
        const totalRevenue = invoices
            .filter((invoice) => invoice.status !== client_1.InvoiceStatus.void)
            .reduce((sum, invoice) => sum + invoice.amount, 0);
        return {
            metrics: {
                totalRevenue,
                totalBookings: bookings.length,
                pendingJobs: bookings.filter((booking) => booking.status === client_1.BookingStatus.pending).length,
                completedJobs: bookings.filter((booking) => booking.status === client_1.BookingStatus.completed).length,
                activeTechnicians: technicians,
            },
            activity: bookings.slice(0, 10).map((booking) => ({
                id: booking.id,
                status: booking.status,
                createdAt: booking.createdAt,
                serviceId: booking.serviceId,
            })),
        };
    }
    async listBookings() {
        return this.prisma.booking.findMany({
            include: { user: true, service: true, technician: true },
            orderBy: [{ date: "desc" }, { time: "desc" }],
        });
    }
    async getBooking(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { user: true, service: true, technician: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        return booking;
    }
    async updateBooking(id, dto) {
        const existing = await this.prisma.booking.findUnique({
            where: { id },
            include: { service: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const updated = await this.prisma.booking.update({
            where: { id },
            data: {
                ...(dto.status ? { status: dto.status } : {}),
                ...(dto.technicianId !== undefined ? { technicianId: dto.technicianId } : {}),
            },
            include: { technician: true },
        });
        if (dto.status === client_1.BookingStatus.confirmed) {
            this.eventsService.emit(event_types_1.domainEventTypes.BOOKING_CONFIRMED, {
                bookingId: updated.id,
                userId: updated.userId,
                serviceName: existing.service.name,
                date: updated.date.toISOString().slice(0, 10),
                time: updated.time,
                address: updated.address,
                status: updated.status,
            });
        }
        if (dto.status === client_1.BookingStatus.in_progress) {
            this.eventsService.emit(event_types_1.domainEventTypes.BOOKING_STARTED, {
                bookingId: updated.id,
                userId: updated.userId,
                serviceName: existing.service.name,
                date: updated.date.toISOString().slice(0, 10),
                time: updated.time,
                address: updated.address,
                status: updated.status,
            });
        }
        if (dto.status === client_1.BookingStatus.completed) {
            this.eventsService.emit(event_types_1.domainEventTypes.BOOKING_COMPLETED, {
                bookingId: updated.id,
                userId: updated.userId,
                serviceName: existing.service.name,
                date: updated.date.toISOString().slice(0, 10),
                time: updated.time,
                address: updated.address,
                status: updated.status,
            });
        }
        if (dto.status === client_1.BookingStatus.cancelled) {
            this.eventsService.emit(event_types_1.domainEventTypes.BOOKING_CANCELLED, {
                bookingId: updated.id,
                userId: updated.userId,
                serviceName: existing.service.name,
                date: updated.date.toISOString().slice(0, 10),
                time: updated.time,
                address: updated.address,
                status: updated.status,
            });
        }
        if (dto.technicianId !== undefined) {
            this.eventsService.emit(event_types_1.domainEventTypes.TECHNICIAN_ASSIGNED, {
                bookingId: updated.id,
                userId: updated.userId,
                serviceName: existing.service.name,
                date: updated.date.toISOString().slice(0, 10),
                time: updated.time,
                address: updated.address,
                status: updated.status,
                technicianName: updated.technician?.name ?? null,
            });
        }
        return updated;
    }
    async assignTechnician(dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { service: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (dto.technicianId) {
            await this.techniciansService.update(dto.technicianId, { status: "busy" });
        }
        const updated = await this.prisma.booking.update({
            where: { id: dto.bookingId },
            data: {
                technicianId: dto.technicianId ?? null,
                status: dto.technicianId ? client_1.BookingStatus.assigned : client_1.BookingStatus.confirmed,
            },
            include: { technician: true },
        });
        this.eventsService.emit(event_types_1.domainEventTypes.TECHNICIAN_ASSIGNED, {
            bookingId: updated.id,
            userId: updated.userId,
            serviceName: booking.service.name,
            date: updated.date.toISOString().slice(0, 10),
            time: updated.time,
            address: updated.address,
            status: updated.status,
            technicianName: updated.technician?.name ?? null,
        });
        return updated;
    }
    async listServices() {
        return this.prisma.service.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
    }
    async createService(dto) {
        return this.prisma.service.create({
            data: {
                name: dto.name.trim(),
                slug: dto.slug?.trim() || null,
                imageUrl: dto.imageUrl?.trim() || null,
                category: dto.category.trim(),
                basePrice: dto.basePrice,
                duration: dto.duration,
            },
        });
    }
    async updateService(id, dto) {
        const existing = await this.prisma.service.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException("Service not found");
        }
        return this.prisma.service.update({
            where: { id },
            data: {
                name: dto.name.trim(),
                slug: dto.slug?.trim() || null,
                imageUrl: dto.imageUrl?.trim() || null,
                category: dto.category.trim(),
                basePrice: dto.basePrice,
                duration: dto.duration,
            },
        });
    }
    async deleteService(id) {
        const bookings = await this.prisma.booking.count({ where: { serviceId: id } });
        if (bookings > 0) {
            throw new common_1.BadRequestException(`Cannot delete this service while ${bookings} booking(s) still reference it.`);
        }
        await this.prisma.service.delete({ where: { id } });
    }
    async listUsers() {
        const users = await this.prisma.user.findMany({
            include: {
                _count: {
                    select: { bookings: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            isBlocked: user.isBlocked,
            createdAt: user.createdAt.toISOString(),
            bookingsCount: user._count.bookings,
        }));
    }
    async blockUser(userId, block) {
        const existing = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!existing) {
            throw new common_1.NotFoundException("User not found");
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { isBlocked: block },
        });
    }
    async analytics() {
        const [bookings, services] = await Promise.all([
            this.prisma.booking.findMany(),
            this.prisma.service.findMany(),
        ]);
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0);
        const byMonth = new Map();
        for (const booking of bookings) {
            const key = booking.createdAt.toISOString().slice(0, 7);
            byMonth.set(key, (byMonth.get(key) ?? 0) + booking.price);
        }
        const popularity = services.map((service) => ({
            serviceId: service.id,
            name: service.name,
            count: bookings.filter((booking) => booking.serviceId === service.id).length,
        }));
        const byTime = new Map();
        for (const booking of bookings) {
            byTime.set(booking.time, (byTime.get(booking.time) ?? 0) + 1);
        }
        return {
            totalRevenue,
            monthlyRevenue: Array.from(byMonth.entries())
                .sort(([a], [b]) => (a > b ? 1 : -1))
                .map(([month, value]) => ({ month, value })),
            popularServices: popularity.sort((a, b) => b.count - a.count).slice(0, 8),
            peakBookingTimes: Array.from(byTime.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([time, count]) => ({ time, count })),
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        technicians_service_1.TechniciansService,
        events_service_1.EventsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map