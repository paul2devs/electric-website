import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { MarkNotificationReadDto } from "./dto/mark-notification-read.dto";
import { NotificationsService, type NotificationResponse } from "./notifications.service";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    list(req: AuthRequest): Promise<{
        items: NotificationResponse[];
        unreadCount: number;
    }>;
    markRead(req: AuthRequest, id: string, dto: MarkNotificationReadDto): Promise<NotificationResponse>;
}
