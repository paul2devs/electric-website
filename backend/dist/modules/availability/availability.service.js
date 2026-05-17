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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
const services_service_1 = require("../services/services.service");
let AvailabilityService = class AvailabilityService {
    prisma;
    redisService;
    servicesService;
    config;
    constructor(prisma, redisService, servicesService, config) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.servicesService = servicesService;
        this.config = config;
    }
    buildSlots(durationMinutes) {
        const start = this.config.get("BOOKING_DAY_START", "09:00");
        const end = this.config.get("BOOKING_DAY_END", "18:00");
        const interval = this.config.get("BOOKING_SLOT_INTERVAL_MINUTES", 60);
        const startMinutes = this.toMinutes(start);
        const endMinutes = this.toMinutes(end);
        const result = [];
        const stepMinutes = Math.max(interval, durationMinutes);
        for (let cursor = startMinutes; cursor + durationMinutes <= endMinutes; cursor += stepMinutes) {
            result.push(this.toTime(cursor));
        }
        return result;
    }
    async getAvailability(serviceId, date) {
        const service = await this.servicesService.findById(serviceId);
        if (!service) {
            throw new common_1.NotFoundException("Service not found");
        }
        const slots = this.buildSlots(service.duration);
        const range = this.dayRange(date);
        const bookings = await this.prisma.booking.findMany({
            where: {
                serviceId,
                date: {
                    gte: range.start,
                    lt: range.end,
                },
            },
            select: { time: true },
        });
        const booked = new Set(bookings.map((booking) => booking.time));
        const available = [];
        for (const slot of slots) {
            if (booked.has(slot)) {
                continue;
            }
            const locked = await this.isSlotLocked(serviceId, date, slot);
            if (!locked) {
                available.push(slot);
            }
        }
        return available;
    }
    async lockSlot(params) {
        const service = await this.servicesService.findById(params.serviceId);
        if (!service) {
            throw new common_1.NotFoundException("Service not found");
        }
        const range = this.dayRange(params.date);
        const existing = await this.prisma.booking.findFirst({
            where: {
                serviceId: params.serviceId,
                date: {
                    gte: range.start,
                    lt: range.end,
                },
                time: params.time,
            },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.BadRequestException("This time slot is no longer available");
        }
        const client = await this.redisService.getConnectedClient();
        if (!client) {
            throw new common_1.InternalServerErrorException("Slot locking unavailable");
        }
        const ttl = this.config.get("BOOKING_LOCK_TTL_SECONDS", 300);
        const key = this.lockKey(params.serviceId, params.date, params.time);
        const token = `${params.userId}:${crypto.randomUUID()}`;
        const response = await client.set(key, token, "EX", ttl, "NX");
        if (response !== "OK") {
            throw new common_1.BadRequestException("This time slot is already locked");
        }
        return { lockToken: token, expiresInSeconds: ttl };
    }
    async unlockSlot(params) {
        const client = await this.redisService.getConnectedClient();
        if (!client) {
            return;
        }
        const key = this.lockKey(params.serviceId, params.date, params.time);
        const current = await client.get(key);
        if (current === params.lockToken) {
            await client.del(key);
        }
    }
    async ensureSlotLock(params) {
        const client = await this.redisService.getConnectedClient();
        if (!client) {
            throw new common_1.InternalServerErrorException("Slot locking unavailable");
        }
        const key = this.lockKey(params.serviceId, params.date, params.time);
        const current = await client.get(key);
        const expectedPrefix = `${params.userId}:`;
        if (!current || current !== params.lockToken || !current.startsWith(expectedPrefix)) {
            throw new common_1.BadRequestException("Slot lock expired or invalid");
        }
    }
    dayRange(dateStr) {
        const date = new Date(`${dateStr}T00:00:00.000Z`);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException("Invalid date format");
        }
        const end = new Date(date);
        end.setUTCDate(end.getUTCDate() + 1);
        return { start: date, end };
    }
    normalizeDate(dateStr) {
        return this.dayRange(dateStr).start;
    }
    lockKey(serviceId, date, time) {
        return `lock:${serviceId}:${date}:${time}`;
    }
    async isSlotLocked(serviceId, date, time) {
        const client = await this.redisService.getConnectedClient();
        if (!client) {
            return false;
        }
        const key = this.lockKey(serviceId, date, time);
        const value = await client.get(key);
        return value !== null;
    }
    toMinutes(value) {
        const [h, m] = value.split(":").map((part) => Number(part));
        if (Number.isNaN(h) ||
            Number.isNaN(m) ||
            h < 0 ||
            h > 23 ||
            m < 0 ||
            m > 59) {
            throw new common_1.BadRequestException("Invalid booking time configuration");
        }
        return h * 60 + m;
    }
    toTime(totalMinutes) {
        const h = Math.floor(totalMinutes / 60)
            .toString()
            .padStart(2, "0");
        const m = (totalMinutes % 60).toString().padStart(2, "0");
        return `${h}:${m}`;
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        services_service_1.ServicesService,
        config_1.ConfigService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map