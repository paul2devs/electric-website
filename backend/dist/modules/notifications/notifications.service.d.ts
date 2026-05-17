import { PrismaService } from "../../prisma/prisma.service";
export type NotificationResponse = {
    id: string;
    userId: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
};
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: {
        userId: string;
        type: string;
        message: string;
    }): Promise<NotificationResponse>;
    listForUser(userId: string): Promise<NotificationResponse[]>;
    unreadCount(userId: string): Promise<number>;
    markRead(userId: string, id: string, read: boolean): Promise<NotificationResponse>;
    private toResponse;
}
