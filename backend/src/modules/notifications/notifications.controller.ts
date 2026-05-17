import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { MarkNotificationReadDto } from "./dto/mark-notification-read.dto";
import { NotificationsService, type NotificationResponse } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@Req() req: AuthRequest): Promise<{ items: NotificationResponse[]; unreadCount: number }> {
    const [items, unreadCount] = await Promise.all([
      this.notificationsService.listForUser(req.user.id),
      this.notificationsService.unreadCount(req.user.id),
    ]);
    return { items, unreadCount };
  }

  @Patch(":id")
  async markRead(
    @Req() req: AuthRequest,
    @Param("id") id: string,
    @Body() dto: MarkNotificationReadDto,
  ): Promise<NotificationResponse> {
    return this.notificationsService.markRead(req.user.id, id, dto.read);
  }
}
