import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { BookingStatus, InvoiceStatus } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { domainEventTypes } from "../events/constants/event-types";
import { EventsService } from "../events/events.service";
import { TechniciansService } from "../technicians/technicians.service";
import { AdminAssignTechnicianDto } from "./dto/admin-assign-technician.dto";
import { AdminServiceUpsertDto } from "./dto/admin-service-upsert.dto";
import { AdminUpdateBookingDto } from "./dto/admin-update-booking.dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly techniciansService: TechniciansService,
    private readonly eventsService: EventsService,
  ) {}

  async overview() {
    const [bookings, technicians, invoices] = await Promise.all([
      this.prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
      this.prisma.technician.count({ where: { status: "available" } }),
      this.prisma.invoice.findMany(),
    ]);

    const totalRevenue = invoices
      .filter((invoice) => invoice.status !== InvoiceStatus.void)
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    return {
      metrics: {
        totalRevenue,
        totalBookings: bookings.length,
        pendingJobs: bookings.filter((booking) => booking.status === BookingStatus.pending).length,
        completedJobs: bookings.filter((booking) => booking.status === BookingStatus.completed).length,
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

  async getBooking(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, service: true, technician: true },
    });
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    return booking;
  }

  async updateBooking(id: string, dto: AdminUpdateBookingDto) {
    const existing = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!existing) {
      throw new NotFoundException("Booking not found");
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.technicianId !== undefined ? { technicianId: dto.technicianId } : {}),
      },
      include: { technician: true },
    });

    if (dto.status === BookingStatus.confirmed) {
      this.eventsService.emit(domainEventTypes.BOOKING_CONFIRMED, {
        bookingId: updated.id,
        userId: updated.userId,
        serviceName: existing.service.name,
        date: updated.date.toISOString().slice(0, 10),
        time: updated.time,
        address: updated.address,
        status: updated.status,
      });
    }

    if (dto.status === BookingStatus.in_progress) {
      this.eventsService.emit(domainEventTypes.BOOKING_STARTED, {
        bookingId: updated.id,
        userId: updated.userId,
        serviceName: existing.service.name,
        date: updated.date.toISOString().slice(0, 10),
        time: updated.time,
        address: updated.address,
        status: updated.status,
      });
    }

    if (dto.status === BookingStatus.completed) {
      this.eventsService.emit(domainEventTypes.BOOKING_COMPLETED, {
        bookingId: updated.id,
        userId: updated.userId,
        serviceName: existing.service.name,
        date: updated.date.toISOString().slice(0, 10),
        time: updated.time,
        address: updated.address,
        status: updated.status,
      });
    }

    if (dto.status === BookingStatus.cancelled) {
      this.eventsService.emit(domainEventTypes.BOOKING_CANCELLED, {
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
      this.eventsService.emit(domainEventTypes.TECHNICIAN_ASSIGNED, {
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

  async assignTechnician(dto: AdminAssignTechnicianDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { service: true },
    });
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (dto.technicianId) {
      await this.techniciansService.update(dto.technicianId, { status: "busy" });
    }

    const updated = await this.prisma.booking.update({
      where: { id: dto.bookingId },
      data: {
        technicianId: dto.technicianId ?? null,
        status: dto.technicianId ? BookingStatus.assigned : BookingStatus.confirmed,
      },
      include: { technician: true },
    });

    this.eventsService.emit(domainEventTypes.TECHNICIAN_ASSIGNED, {
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

  async createService(dto: AdminServiceUpsertDto) {
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

  async updateService(id: string, dto: AdminServiceUpsertDto) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Service not found");
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

  async deleteService(id: string): Promise<void> {
    const bookings = await this.prisma.booking.count({ where: { serviceId: id } });
    if (bookings > 0) {
      throw new BadRequestException(
        `Cannot delete this service while ${bookings} booking(s) still reference it.`,
      );
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

  async blockUser(userId: string, block: boolean) {
    const existing = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new NotFoundException("User not found");
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

    const byMonth = new Map<string, number>();
    for (const booking of bookings) {
      const key = booking.createdAt.toISOString().slice(0, 7);
      byMonth.set(key, (byMonth.get(key) ?? 0) + booking.price);
    }

    const popularity = services.map((service) => ({
      serviceId: service.id,
      name: service.name,
      count: bookings.filter((booking) => booking.serviceId === service.id).length,
    }));

    const byTime = new Map<string, number>();
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
}
