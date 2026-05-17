import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BookingStatus, InvoiceStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { AvailabilityService } from "../availability/availability.service";
import { domainEventTypes } from "../events/constants/event-types";
import { EventsService } from "../events/events.service";
import { PricingService } from "../pricing/pricing.service";
import type { SafeUser } from "../users/users.service";
import { bookingStatuses, type BookingStatusType } from "./constants/booking-status";
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

type BookingRow = {
  id: string;
  serviceId: string;
  userId: string;
  date: Date;
  time: string;
  status: BookingStatus;
  address: string;
  phone: string;
  notes: string | null;
  addOnIds: string[];
  distanceKm: number;
  baseAmount: number;
  urgencyFee: number;
  distanceFee: number;
  addonsFee: number;
  price: number;
  createdAt: Date;
};

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
    private readonly pricingService: PricingService,
    private readonly eventsService: EventsService,
  ) {}

  async createBooking(
    user: SafeUser,
    dto: CreateBookingDto,
  ): Promise<BookingResponse> {
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
      throw new BadRequestException("Price has changed. Review and confirm again.");
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
          throw new ConflictException("This slot has already been booked");
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
            status: BookingStatus.pending,
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

      this.eventsService.emit(domainEventTypes.BOOKING_CREATED, {
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

      return this.toResponse(booking as BookingRow, service?.name);
    } catch (error) {
      if (error instanceof ConflictException) {
        await this.availabilityService.unlockSlot({
          serviceId: dto.serviceId,
          date: dto.date,
          time: dto.time,
          lockToken: dto.lockToken,
        });
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("This slot has already been booked");
      }

      throw error;
    }
  }

  async listForUser(userId: string): Promise<BookingResponse[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: { service: true },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });
    return bookings.map((booking) =>
      this.toResponse(booking as BookingRow, booking.service.name),
    );
  }

  async getForUser(userId: string, bookingId: string): Promise<BookingResponse> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { service: true },
    });
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    return this.toResponse(booking as BookingRow, booking.service.name);
  }

  async cancelForUser(userId: string, bookingId: string): Promise<BookingResponse> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { service: true },
    });
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (
      booking.status === BookingStatus.completed ||
      booking.status === BookingStatus.cancelled
    ) {
      throw new BadRequestException("Booking cannot be cancelled");
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const row = await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.cancelled },
        include: { service: true },
      });
      await tx.invoice.updateMany({
        where: { bookingId },
        data: { status: InvoiceStatus.void },
      });
      return row;
    });

    this.eventsService.emit(domainEventTypes.BOOKING_CANCELLED, {
      bookingId: updated.id,
      userId: updated.userId,
      serviceName: booking.service.name,
      date: updated.date.toISOString().slice(0, 10),
      time: updated.time,
      address: updated.address,
      status: updated.status,
    });

    return this.toResponse(updated as BookingRow, updated.service.name);
  }

  async rescheduleForUser(
    userId: string,
    bookingId: string,
    dto: RescheduleBookingDto,
  ): Promise<BookingResponse> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { service: true },
    });
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (
      booking.status === BookingStatus.completed ||
      booking.status === BookingStatus.cancelled
    ) {
      throw new BadRequestException("Booking cannot be rescheduled");
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
      throw new BadRequestException("Price has changed. Review and confirm again.");
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
      throw new ConflictException("This slot has already been booked");
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

      this.eventsService.emit(domainEventTypes.BOOKING_RESCHEDULED, {
        bookingId: updated.id,
        userId: updated.userId,
        serviceName: booking.service.name,
        date: updated.date.toISOString().slice(0, 10),
        time: updated.time,
        address: updated.address,
        status: updated.status,
      });

      return this.toResponse(updated as BookingRow, updated.service.name);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        await this.availabilityService.unlockSlot({
          serviceId: booking.serviceId,
          date: dto.date,
          time: dto.time,
          lockToken: dto.lockToken,
        });
        throw new ConflictException("This slot has already been booked");
      }
      throw error;
    }
  }

  async updateStatus(
    bookingId: string,
    status: BookingStatusType,
    actor: SafeUser,
  ): Promise<BookingResponse> {
    if (actor.role !== "admin") {
      throw new ForbiddenException("Admin role required");
    }

    if (!bookingStatuses.includes(status)) {
      throw new BadRequestException("Invalid status");
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as BookingStatus },
      include: { service: true },
    });

    const eventType =
      status === "confirmed"
        ? domainEventTypes.BOOKING_CONFIRMED
        : status === "in_progress"
          ? domainEventTypes.BOOKING_STARTED
          : status === "completed"
            ? domainEventTypes.BOOKING_COMPLETED
            : status === "cancelled"
              ? domainEventTypes.BOOKING_CANCELLED
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

    return this.toResponse(updated as BookingRow, updated.service.name);
  }

  private toResponse(booking: BookingRow, serviceName?: string): BookingResponse {
    return {
      id: booking.id,
      serviceId: booking.serviceId,
      ...(serviceName ? { serviceName } : {}),
      userId: booking.userId,
      date: booking.date.toISOString().slice(0, 10),
      time: booking.time,
      status: booking.status as BookingStatusType,
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
}
