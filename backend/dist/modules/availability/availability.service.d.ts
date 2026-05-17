import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { ServicesService } from "../services/services.service";
type SlotDateRange = {
    start: Date;
    end: Date;
};
export declare class AvailabilityService {
    private readonly prisma;
    private readonly redisService;
    private readonly servicesService;
    private readonly config;
    constructor(prisma: PrismaService, redisService: RedisService, servicesService: ServicesService, config: ConfigService);
    buildSlots(durationMinutes: number): string[];
    getAvailability(serviceId: string, date: string): Promise<string[]>;
    lockSlot(params: {
        serviceId: string;
        date: string;
        time: string;
        userId: string;
    }): Promise<{
        lockToken: string;
        expiresInSeconds: number;
    }>;
    unlockSlot(params: {
        serviceId: string;
        date: string;
        time: string;
        lockToken: string;
    }): Promise<void>;
    ensureSlotLock(params: {
        serviceId: string;
        date: string;
        time: string;
        lockToken: string;
        userId: string;
    }): Promise<void>;
    dayRange(dateStr: string): SlotDateRange;
    normalizeDate(dateStr: string): Date;
    lockKey(serviceId: string, date: string, time: string): string;
    private isSlotLocked;
    private toMinutes;
    private toTime;
}
export {};
