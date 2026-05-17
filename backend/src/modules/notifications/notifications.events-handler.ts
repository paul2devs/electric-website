import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { domainEventTypes } from "../events/constants/event-types";
import { NotificationsQueue } from "./notifications.queue";
import type { BookingEventPayload } from "./types/domain-event-payloads";

@Injectable()
export class NotificationsEventsHandler {
  constructor(private readonly notificationsQueue: NotificationsQueue) {}

  @OnEvent(domainEventTypes.BOOKING_CREATED)
  async onBookingCreated(payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    await this.notificationsQueue.enqueue(domainEventTypes.BOOKING_CREATED, payload);
  }

  @OnEvent(domainEventTypes.BOOKING_RESCHEDULED)
  async onBookingRescheduled(payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    await this.notificationsQueue.enqueue(domainEventTypes.BOOKING_RESCHEDULED, payload);
  }

  @OnEvent(domainEventTypes.BOOKING_CONFIRMED)
  async onBookingConfirmed(payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    await this.notificationsQueue.enqueue(domainEventTypes.BOOKING_CONFIRMED, payload);
  }

  @OnEvent(domainEventTypes.TECHNICIAN_ASSIGNED)
  async onTechnicianAssigned(payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    await this.notificationsQueue.enqueue(domainEventTypes.TECHNICIAN_ASSIGNED, payload);
  }

  @OnEvent(domainEventTypes.BOOKING_STARTED)
  async onBookingStarted(payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    await this.notificationsQueue.enqueue(domainEventTypes.BOOKING_STARTED, payload);
  }

  @OnEvent(domainEventTypes.BOOKING_COMPLETED)
  async onBookingCompleted(payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    await this.notificationsQueue.enqueue(domainEventTypes.BOOKING_COMPLETED, payload);
  }

  @OnEvent(domainEventTypes.BOOKING_CANCELLED)
  async onBookingCancelled(payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    await this.notificationsQueue.enqueue(domainEventTypes.BOOKING_CANCELLED, payload);
  }
}
