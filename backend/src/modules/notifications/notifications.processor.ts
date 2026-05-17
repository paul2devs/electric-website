import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Worker } from "bullmq";

import { shouldRunNotificationWorker } from "../../config/deployment";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { domainEventTypes } from "../events/constants/event-types";
import { EmailService } from "./email/email.service";
import { NotificationsGateway } from "./realtime/notifications.gateway";
import { NotificationsService } from "./notifications.service";
import type { BookingEventPayload } from "./types/domain-event-payloads";

@Injectable()
export class NotificationsProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsProcessor.name);
  private worker: Worker<BookingEventPayload> | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!shouldRunNotificationWorker()) {
      this.logger.warn("Notification worker disabled for serverless runtime.");
      return;
    }

    const url = this.config.get<string>("REDIS_URL");
    if (!url) {
      this.logger.warn("REDIS_URL missing. Notification worker is disabled.");
      return;
    }

    const redisClient = await this.redisService.getConnectedClient();
    if (!redisClient) {
      this.logger.warn("Redis unavailable. Notification worker is disabled.");
      return;
    }

    this.worker = new Worker<BookingEventPayload>(
      "notifications-queue",
      async (job) => {
        await this.processJob(job.data);
      },
      {
        connection: redisClient.duplicate(),
        concurrency: 4,
      },
    );
  }

  async onModuleDestroy(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
    }
  }

  private async processJob(payload: BookingEventPayload): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return;
    }

    const template = this.buildTemplate(payload);

    const notification = await this.notificationsService.create({
      userId: payload.userId,
      type: payload.eventType,
      message: template.message,
    });

    await this.emailService.send({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    this.gateway.emitToUser(payload.userId, "booking_updated", {
      bookingId: payload.bookingId,
      status: payload.status,
      type: payload.eventType,
      message: template.message,
      notification,
    });

    this.gateway.emitToAdmins("booking_status_changed", {
      bookingId: payload.bookingId,
      status: payload.status,
      type: payload.eventType,
      userId: payload.userId,
      serviceName: payload.serviceName,
    });

    if (payload.eventType === domainEventTypes.TECHNICIAN_ASSIGNED && payload.technicianName) {
      this.gateway.emitToUser(payload.userId, "technician_assigned", {
        bookingId: payload.bookingId,
        technicianName: payload.technicianName,
      });
      this.gateway.emitToAdmins("technician_assigned", {
        bookingId: payload.bookingId,
        technicianName: payload.technicianName,
      });
    }
  }

  private buildTemplate(payload: BookingEventPayload): {
    subject: string;
    message: string;
    html: string;
  } {
    const base = `${payload.serviceName} on ${payload.date} at ${payload.time}`;

    if (payload.eventType === domainEventTypes.BOOKING_CREATED) {
      return {
        subject: "Booking received",
        message: `Your booking has been created for ${base}.`,
        html: `<p>Your booking has been created.</p><p>${base}</p><p>Address: ${payload.address}</p><p>Status: ${payload.status}</p>`,
      };
    }

    if (payload.eventType === domainEventTypes.BOOKING_RESCHEDULED) {
      return {
        subject: "Booking rescheduled",
        message: `Your appointment was moved to ${base}.`,
        html: `<p>Your booking schedule has been updated.</p><p>${base}</p><p>Address: ${payload.address}</p>`,
      };
    }

    if (payload.eventType === domainEventTypes.BOOKING_CONFIRMED) {
      return {
        subject: "Booking confirmed",
        message: `Your booking is confirmed for ${base}.`,
        html: `<p>Your booking is confirmed.</p><p>${base}</p><p>Status: ${payload.status}</p>`,
      };
    }

    if (payload.eventType === domainEventTypes.TECHNICIAN_ASSIGNED) {
      return {
        subject: "Technician assigned",
        message: `${payload.technicianName ?? "A technician"} has been assigned to your booking.`,
        html: `<p>${payload.technicianName ?? "A technician"} has been assigned.</p><p>${base}</p>`,
      };
    }

    if (payload.eventType === domainEventTypes.BOOKING_STARTED) {
      return {
        subject: "Service started",
        message: `Your service has started for ${base}.`,
        html: `<p>Your service has started.</p><p>${base}</p>`,
      };
    }

    if (payload.eventType === domainEventTypes.BOOKING_COMPLETED) {
      return {
        subject: "Service completed",
        message: `Your service is completed for ${base}.`,
        html: `<p>Your service is complete.</p><p>${base}</p><p>View invoice in your dashboard.</p>`,
      };
    }

    return {
      subject: "Booking update",
      message: `Your booking has been updated for ${base}.`,
      html: `<p>Your booking has been updated.</p><p>${base}</p><p>Status: ${payload.status}</p>`,
    };
  }
}
