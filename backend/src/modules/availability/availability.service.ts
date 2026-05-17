import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { ServicesService } from "../services/services.service";

type SlotDateRange = {
  start: Date;
  end: Date;
};

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly servicesService: ServicesService,
    private readonly config: ConfigService,
  ) {}

  buildSlots(durationMinutes: number): string[] {
    const start = this.config.get<string>("BOOKING_DAY_START", "09:00");
    const end = this.config.get<string>("BOOKING_DAY_END", "18:00");
    const interval = this.config.get<number>("BOOKING_SLOT_INTERVAL_MINUTES", 60);

    const startMinutes = this.toMinutes(start);
    const endMinutes = this.toMinutes(end);
    const result: string[] = [];
    const stepMinutes = Math.max(interval, durationMinutes);

    for (
      let cursor = startMinutes;
      cursor + durationMinutes <= endMinutes;
      cursor += stepMinutes
    ) {
      result.push(this.toTime(cursor));
    }

    return result;
  }

  async getAvailability(serviceId: string, date: string): Promise<string[]> {
    const service = await this.servicesService.findById(serviceId);
    if (!service) {
      throw new NotFoundException("Service not found");
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
    const available: string[] = [];
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

  async lockSlot(params: {
    serviceId: string;
    date: string;
    time: string;
    userId: string;
  }): Promise<{ lockToken: string; expiresInSeconds: number }> {
    const service = await this.servicesService.findById(params.serviceId);
    if (!service) {
      throw new NotFoundException("Service not found");
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
      throw new BadRequestException("This time slot is no longer available");
    }

    const client = await this.redisService.getConnectedClient();
    if (!client) {
      throw new InternalServerErrorException("Slot locking unavailable");
    }

    const ttl = this.config.get<number>("BOOKING_LOCK_TTL_SECONDS", 300);
    const key = this.lockKey(params.serviceId, params.date, params.time);
    const token = `${params.userId}:${crypto.randomUUID()}`;

    const response = await client.set(key, token, "EX", ttl, "NX");
    if (response !== "OK") {
      throw new BadRequestException("This time slot is already locked");
    }

    return { lockToken: token, expiresInSeconds: ttl };
  }

  async unlockSlot(params: {
    serviceId: string;
    date: string;
    time: string;
    lockToken: string;
  }): Promise<void> {
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

  async ensureSlotLock(params: {
    serviceId: string;
    date: string;
    time: string;
    lockToken: string;
    userId: string;
  }): Promise<void> {
    const client = await this.redisService.getConnectedClient();
    if (!client) {
      throw new InternalServerErrorException("Slot locking unavailable");
    }
    const key = this.lockKey(params.serviceId, params.date, params.time);
    const current = await client.get(key);
    const expectedPrefix = `${params.userId}:`;
    if (!current || current !== params.lockToken || !current.startsWith(expectedPrefix)) {
      throw new BadRequestException("Slot lock expired or invalid");
    }
  }

  dayRange(dateStr: string): SlotDateRange {
    const date = new Date(`${dateStr}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException("Invalid date format");
    }
    const end = new Date(date);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start: date, end };
  }

  normalizeDate(dateStr: string): Date {
    return this.dayRange(dateStr).start;
  }

  lockKey(serviceId: string, date: string, time: string): string {
    return `lock:${serviceId}:${date}:${time}`;
  }

  private async isSlotLocked(
    serviceId: string,
    date: string,
    time: string,
  ): Promise<boolean> {
    const client = await this.redisService.getConnectedClient();
    if (!client) {
      return false;
    }
    const key = this.lockKey(serviceId, date, time);
    const value = await client.get(key);
    return value !== null;
  }

  private toMinutes(value: string): number {
    const [h, m] = value.split(":").map((part) => Number(part));
    if (
      Number.isNaN(h) ||
      Number.isNaN(m) ||
      h < 0 ||
      h > 23 ||
      m < 0 ||
      m > 59
    ) {
      throw new BadRequestException("Invalid booking time configuration");
    }
    return h * 60 + m;
  }

  private toTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (totalMinutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }
}
