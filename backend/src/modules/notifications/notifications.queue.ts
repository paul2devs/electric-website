import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";

import { RedisService } from "../../redis/redis.service";
import type { DomainEventType } from "../events/constants/event-types";
import type { BookingEventPayload } from "./types/domain-event-payloads";

@Injectable()
export class NotificationsQueue implements OnModuleDestroy {
  private readonly logger = new Logger(NotificationsQueue.name);
  private queue: Queue<BookingEventPayload> | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private async getQueue(): Promise<Queue<BookingEventPayload> | null> {
    if (this.queue) {
      return this.queue;
    }

    const url = this.config.get<string>("REDIS_URL");
    if (!url) {
      return null;
    }

    const client = await this.redisService.getConnectedClient();
    if (!client) {
      return null;
    }

    this.queue = new Queue<BookingEventPayload>("notifications-queue", {
      connection: client.duplicate(),
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: 20,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    });

    return this.queue;
  }

  async enqueue(eventType: DomainEventType, payload: Omit<BookingEventPayload, "eventType">): Promise<void> {
    const queue = await this.getQueue();
    if (!queue) {
      this.logger.warn("Queue unavailable, notification event skipped");
      return;
    }

    await queue.add(`notify:${eventType}`, {
      eventType,
      ...payload,
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.queue) {
      await this.queue.close();
    }
  }
}
