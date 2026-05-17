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
var NotificationsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProcessor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const deployment_1 = require("../../config/deployment");
const prisma_service_1 = require("../../prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
const event_types_1 = require("../events/constants/event-types");
const email_service_1 = require("./email/email.service");
const notifications_gateway_1 = require("./realtime/notifications.gateway");
const notifications_service_1 = require("./notifications.service");
let NotificationsProcessor = NotificationsProcessor_1 = class NotificationsProcessor {
    config;
    redisService;
    prisma;
    notificationsService;
    emailService;
    gateway;
    logger = new common_1.Logger(NotificationsProcessor_1.name);
    worker = null;
    constructor(config, redisService, prisma, notificationsService, emailService, gateway) {
        this.config = config;
        this.redisService = redisService;
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
        this.gateway = gateway;
    }
    async onModuleInit() {
        if (!(0, deployment_1.shouldRunNotificationWorker)()) {
            this.logger.warn("Notification worker disabled for serverless runtime.");
            return;
        }
        const url = this.config.get("REDIS_URL");
        if (!url) {
            this.logger.warn("REDIS_URL missing. Notification worker is disabled.");
            return;
        }
        const redisClient = await this.redisService.getConnectedClient();
        if (!redisClient) {
            this.logger.warn("Redis unavailable. Notification worker is disabled.");
            return;
        }
        this.worker = new bullmq_1.Worker("notifications-queue", async (job) => {
            await this.processJob(job.data);
        }, {
            connection: redisClient.duplicate(),
            concurrency: 4,
        });
    }
    async onModuleDestroy() {
        if (this.worker) {
            await this.worker.close();
        }
    }
    async processJob(payload) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) {
            return;
        }
        const template = this.buildTemplate(payload);
        const notification = await this.notificationsService.create({
            userId: payload.userId,
            type: payload.eventType,
            message: template.message,
        });
        await this.emailService.send({
            to: user.email,
            subject: template.subject,
            html: template.html,
        });
        this.gateway.emitToUser(payload.userId, "booking_updated", {
            bookingId: payload.bookingId,
            status: payload.status,
            type: payload.eventType,
            message: template.message,
            notification,
        });
        this.gateway.emitToAdmins("booking_status_changed", {
            bookingId: payload.bookingId,
            status: payload.status,
            type: payload.eventType,
            userId: payload.userId,
            serviceName: payload.serviceName,
        });
        if (payload.eventType === event_types_1.domainEventTypes.TECHNICIAN_ASSIGNED && payload.technicianName) {
            this.gateway.emitToUser(payload.userId, "technician_assigned", {
                bookingId: payload.bookingId,
                technicianName: payload.technicianName,
            });
            this.gateway.emitToAdmins("technician_assigned", {
                bookingId: payload.bookingId,
                technicianName: payload.technicianName,
            });
        }
    }
    buildTemplate(payload) {
        const base = `${payload.serviceName} on ${payload.date} at ${payload.time}`;
        if (payload.eventType === event_types_1.domainEventTypes.BOOKING_CREATED) {
            return {
                subject: "Booking received",
                message: `Your booking has been created for ${base}.`,
                html: `<p>Your booking has been created.</p><p>${base}</p><p>Address: ${payload.address}</p><p>Status: ${payload.status}</p>`,
            };
        }
        if (payload.eventType === event_types_1.domainEventTypes.BOOKING_RESCHEDULED) {
            return {
                subject: "Booking rescheduled",
                message: `Your appointment was moved to ${base}.`,
                html: `<p>Your booking schedule has been updated.</p><p>${base}</p><p>Address: ${payload.address}</p>`,
            };
        }
        if (payload.eventType === event_types_1.domainEventTypes.BOOKING_CONFIRMED) {
            return {
                subject: "Booking confirmed",
                message: `Your booking is confirmed for ${base}.`,
                html: `<p>Your booking is confirmed.</p><p>${base}</p><p>Status: ${payload.status}</p>`,
            };
        }
        if (payload.eventType === event_types_1.domainEventTypes.TECHNICIAN_ASSIGNED) {
            return {
                subject: "Technician assigned",
                message: `${payload.technicianName ?? "A technician"} has been assigned to your booking.`,
                html: `<p>${payload.technicianName ?? "A technician"} has been assigned.</p><p>${base}</p>`,
            };
        }
        if (payload.eventType === event_types_1.domainEventTypes.BOOKING_STARTED) {
            return {
                subject: "Service started",
                message: `Your service has started for ${base}.`,
                html: `<p>Your service has started.</p><p>${base}</p>`,
            };
        }
        if (payload.eventType === event_types_1.domainEventTypes.BOOKING_COMPLETED) {
            return {
                subject: "Service completed",
                message: `Your service is completed for ${base}.`,
                html: `<p>Your service is complete.</p><p>${base}</p><p>View invoice in your dashboard.</p>`,
            };
        }
        return {
            subject: "Booking update",
            message: `Your booking has been updated for ${base}.`,
            html: `<p>Your booking has been updated.</p><p>${base}</p><p>Status: ${payload.status}</p>`,
        };
    }
};
exports.NotificationsProcessor = NotificationsProcessor;
exports.NotificationsProcessor = NotificationsProcessor = NotificationsProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        redis_service_1.RedisService,
        prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService,
        notifications_gateway_1.NotificationsGateway])
], NotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map