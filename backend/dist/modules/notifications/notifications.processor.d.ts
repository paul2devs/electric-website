import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { EmailService } from "./email/email.service";
import { NotificationsGateway } from "./realtime/notifications.gateway";
import { NotificationsService } from "./notifications.service";
export declare class NotificationsProcessor implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly redisService;
    private readonly prisma;
    private readonly notificationsService;
    private readonly emailService;
    private readonly gateway;
    private readonly logger;
    private worker;
    constructor(config: ConfigService, redisService: RedisService, prisma: PrismaService, notificationsService: NotificationsService, emailService: EmailService, gateway: NotificationsGateway);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private processJob;
    private buildTemplate;
}
