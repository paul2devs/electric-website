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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const availability_service_1 = require("../availability/availability.service");
const event_types_1 = require("../events/constants/event-types");
const events_service_1 = require("../events/events.service");
const pricing_service_1 = require("../pricing/pricing.service");
const booking_status_1 = require("./constants/booking-status");
let BookingsService = class BookingsService {
    prisma;
    availabilityService;
    pricingService;
    eventsService;
    constructor(prisma, availabilityService, pricingService, eventsService) {
        this.prisma = prisma;
        this.availabilityService = availabilityService;
        this.pricingService = pricingService;
        this.eventsService = eventsService;
    }
    async createBooking(user, dto) {
        const pricing = await this.pricingService.calculatePrice({
            serviceId: dto.serviceId,
            date: dto.date,
            time: dto.time,
            address: dto.address,
            mockDistanceKm: dto.mockDistanceKm,
            addOnIds: dto.addOnIds,
        });
        const difference = Math.abs(pricing.breakdown.total - dto.quotedTotal);
        if (difference > 0.01) {
            throw new common_1.BadRequestException("Price has changed. Review and confirm again.");
        }
        await this.availabilityService.ensureSlotLock({
            serviceId: dto.serviceId,
            date: dto.date,
            time: dto.time,
            lockToken: dto.lockToken,
            userId: user.id,
        });
        const day = this.availabilityService.normalizeDate(dto.date);
        try {
            const booking = await this.prisma.$transaction(async (tx) => {
                const existing = await tx.booking.findUnique({
                    where: {
                        serviceId_date_time: {
                            serviceId: dto.serviceId,
                            date: day,
                            time: dto.time,
                        },
                    },
                    select: { id: true },
                });
                if (existing) {
                    throw new common_1.ConflictException("This slot has already been booked");
                }
                const created = await tx.booking.create({
                    data: {
                        userId: user.id,
                        serviceId: dto.serviceId,
                        date: day,
                        time: dto.time,
                        address: dto.address.trim(),
                        phone: dto.phone.trim(),
                        notes: dto.notes?.trim() || null,
                        addOnIds: pricing.addOnIds,
                        distanceKm: pricing.distanceKm,
                        baseAmount: pricing.breakdown.base,
                        urgencyFee: pricing.breakdown.urgency,
                        distanceFee: pricing.breakdown.distance,
                        addonsFee: pricing.breakdown.addons,
                        price: pricing.breakdown.total,
                        status: client_1.BookingStatus.pending,
                    },
                });
                await tx.invoice.create({
                    data: {
                        bookingId: created.id,
                        userId: user.id,
                        amount: created.price,
                    },
                });
                return created;
            });
            const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
            this.eventsService.emit(event_types_1.domainEventTypes.BOOKING_CREATED, {
                bookingId: booking.id,
                userId: user.id,
                serviceName: service?.name ?? "Service",
                date: booking.date.toISOString().slice(0, 10),
                time: booking.time,
                address: booking.address,
                status: booking.status,
            });
            await this.availabilityService.unlockSlot({
                serviceId: dto.serviceId,
                date: dto.date,
                time: dto.time,
                lockToken: dto.lockToken,
            });
            return this.toResponse(booking, service?.name);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                await this.availabilityService.unlockSlot({
                    serviceId: dto.serviceId,
                    date: dto.date,
                    time: dto.time,
                    lockToken: dto.lockToken,
                });
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                throw new common_1.ConflictException("This slot has already been booked");
            }
            throw error;
        }
    }
    async listForUser(userId) {
        const bookings = await this.prisma.booking.findMany({
            where: { userId },
            include: { service: true },
            orderBy: [{ date: "desc" }, { time: "desc" }],
        });
        return bookings.map((booking) => this.toResponse(booking, booking.service.name));
    }
    async getForUser(userId, bookingId) {
        const booking = await this.prisma.booking.findFirst({
            where: { id: bookingId, userId },
            include: { service: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        return this.toResponse(booking, booking.service.name);
    }
    async cancelForUser(userId, bookingId) {
        const booking = await this.prisma.booking.findFirst({
            where: { id: bookingId, userId },
            include: { service: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (booking.status === client_1.BookingStatus.completed ||
            booking.status === client_1.BookingStatus.cancelled) {
            throw new common_1.BadRequestException("Booking cannot be cancelled");
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const row = await tx.booking.update({
                where: { id: bookingId },
                data: { status: client_1.BookingStatus.cancelled },
                include: { service: true },
            });
            await tx.invoice.updateMany({
                where: { bookingId },
                data: { status: client_1.InvoiceStatus.void },
            });
            return row;
        });
        this.eventsService.emit(event_types_1.domainEventTypes.BOOKING_CANCELLED, {
            bookingId: updated.id,
            userId: updated.userId,
            serviceName: booking.service.name,
            date: updated.date.toISOString().slice(0, 10),
            time: updated.time,
            address: updated.address,
            status: updated.status,
        });
        return this.toResponse(updated, updated.service.name);
    }
    async rescheduleForUser(userId, bookingId, dto) {
        const booking = await this.prisma.booking.findFirst({
            where: { id: bookingId, userId },
            include: { service: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        if (booking.status === client_1.BookingStatus.completed ||
            booking.status === client_1.BookingStatus.cancelled) {
            throw new common_1.BadRequestException("Booking cannot be rescheduled");
        }
        await this.availabilityService.ensureSlotLock({
            serviceId: booking.serviceId,
            date: dto.date,
            time: dto.time,
            lockToken: dto.lockToken,
            userId,
        });
        const pricing = await this.pricingService.calculatePrice({
            serviceId: booking.serviceId,
            date: dto.date,
            time: dto.time,
            address: booking.address,
            mockDistanceKm: booking.distanceKm,
            addOnIds: booking.addOnIds,
        });
        if (Math.abs(pricing.breakdown.total - dto.quotedTotal) > 0.01) {
            throw new common_1.BadRequestException("Price has changed. Review and confirm again.");
        }
        const newDay = this.availabilityService.normalizeDate(dto.date);
        const conflict = await this.prisma.booking.findFirst({
            where: {
                serviceId: booking.serviceId,
                date: newDay,
                time: dto.time,
                NOT: { id: bookingId },
            },
            select: { id: true },
        });
        if (conflict) {
            await this.availabilityService.unlockSlot({
                serviceId: booking.serviceId,
                date: dto.date,
                time: dto.time,
                lockToken: dto.lockToken,
            });
            throw new common_1.ConflictException("This slot has already been booked");
        }
        try {
            const updated = await this.prisma.$transaction(async (tx) => {
                const row = await tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        date: newDay,
                        time: dto.time,
                        baseAmount: pricing.breakdown.base,
                        urgencyFee: pricing.breakdown.urgency,
                        distanceFee: pricing.breakdown.distance,
                        addonsFee: pricing.breakdown.addons,
                        price: pricing.breakdown.total,
                        distanceKm: pricing.distanceKm,
                    },
                    include: { service: true },
                });
                await tx.invoice.updateMany({
                    where: { bookingId },
                    data: { amount: row.price },
                });
                return row;
            });
            await this.availabilityService.unlockSlot({
                serviceId: booking.serviceId,
                date: dto.date,
                time: dto.time,
                lockToken: dto.lockToken,
            });
            this.eventsService.emit(event_types_1.domainEventTypes.BOOKING_RESCHEDULED, {
                bookingId: updated.id,
                userId: updated.userId,
                serviceName: booking.service.name,
                date: updated.date.toISOString().slice(0, 10),
                time: updated.time,
                address: updated.address,
                status: updated.status,
            });
            return this.toResponse(updated, updated.service.name);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                await this.availabilityService.unlockSlot({
                    serviceId: booking.serviceId,
                    date: dto.date,
                    time: dto.time,
                    lockToken: dto.lockToken,
                });
                throw new common_1.ConflictException("This slot has already been booked");
            }
            throw error;
        }
    }
    async updateStatus(bookingId, status, actor) {
        if (actor.role !== "admin") {
            throw new common_1.ForbiddenException("Admin role required");
        }
        if (!booking_status_1.bookingStatuses.includes(status)) {
            throw new common_1.BadRequestException("Invalid status");
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { service: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: status },
            include: { service: true },
        });
        const eventType = status === "confirmed"
            ? event_types_1.domainEventTypes.BOOKING_CONFIRMED
            : status === "in_progress"
                ? event_types_1.domainEventTypes.BOOKING_STARTED
                : status === "completed"
                    ? event_types_1.domainEventTypes.BOOKING_COMPLETED
                    : status === "cancelled"
                        ? event_types_1.domainEventTypes.BOOKING_CANCELLED
                        : null;
        if (eventType) {
            this.eventsService.emit(eventType, {
                bookingId: updated.id,
                userId: updated.userId,
                serviceName: booking.service.name,
                date: updated.date.toISOString().slice(0, 10),
                time: updated.time,
                address: updated.address,
                status: updated.status,
            });
        }
        return this.toResponse(updated, updated.service.name);
    }
    toResponse(booking, serviceName) {
        return {
            id: booking.id,
            serviceId: booking.serviceId,
            ...(serviceName ? { serviceName } : {}),
            userId: booking.userId,
            date: booking.date.toISOString().slice(0, 10),
            time: booking.time,
            status: booking.status,
            address: booking.address,
            phone: booking.phone,
            notes: booking.notes,
            addOnIds: booking.addOnIds,
            distanceKm: booking.distanceKm,
            price: booking.price,
            pricing: {
                base: booking.baseAmount,
                urgency: booking.urgencyFee,
                distance: booking.distanceFee,
                addons: booking.addonsFee,
                total: booking.price,
            },
            createdAt: booking.createdAt.toISOString(),
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        availability_service_1.AvailabilityService,
        pricing_service_1.PricingService,
        events_service_1.EventsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map