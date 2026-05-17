import { Injectable, NotFoundException } from "@nestjs/common";
import type { Notification } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";

export type NotificationResponse = {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: {
    userId: string;
    type: string;
    message: string;
  }): Promise<NotificationResponse> {
    const windowStart = new Date(Date.now() - 120_000);
    const duplicate = await this.prisma.notification.findFirst({
      where: {
        userId: input.userId,
        type: input.type,
        message: input.message,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "desc" },
    });
    if (duplicate) {
      return this.toResponse(duplicate);
    }

    const notification = await this.prisma.notification.create({
      data: input,
    });
    return this.toResponse(notification);
  }

  async listForUser(userId: string): Promise<NotificationResponse[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 40,
    });
    return rows.map((row: Notification) => this.toResponse(row));
  }

  async unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }

  async markRead(userId: string, id: string, read: boolean): Promise<NotificationResponse> {
    const existing = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!existing) {
      throw new NotFoundException("Notification not found");
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { read },
    });

    return this.toResponse(updated);
  }

  private toResponse(notification: {
    id: string;
    userId: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }): NotificationResponse {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
