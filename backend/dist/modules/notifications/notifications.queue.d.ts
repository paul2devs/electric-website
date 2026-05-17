import { OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "../../redis/redis.service";
import type { DomainEventType } from "../events/constants/event-types";
import type { BookingEventPayload } from "./types/domain-event-payloads";
export declare class NotificationsQueue implements OnModuleDestroy {
    private readonly config;
    private readonly redisService;
    private readonly logger;
    private queue;
    constructor(config: ConfigService, redisService: RedisService);
    private getQueue;
    enqueue(eventType: DomainEventType, payload: Omit<BookingEventPayload, "eventType">): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
