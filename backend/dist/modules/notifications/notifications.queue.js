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
var NotificationsQueue_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsQueue = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const redis_service_1 = require("../../redis/redis.service");
let NotificationsQueue = NotificationsQueue_1 = class NotificationsQueue {
    config;
    redisService;
    logger = new common_1.Logger(NotificationsQueue_1.name);
    queue = null;
    constructor(config, redisService) {
        this.config = config;
        this.redisService = redisService;
    }
    async getQueue() {
        if (this.queue) {
            return this.queue;
        }
        const url = this.config.get("REDIS_URL");
        if (!url) {
            return null;
        }
        const client = await this.redisService.getConnectedClient();
        if (!client) {
            return null;
        }
        this.queue = new bullmq_1.Queue("notifications-queue", {
            connection: client.duplicate(),
            defaultJobOptions: {
                attempts: 3,
                removeOnComplete: true,
                removeOnFail: 20,
                backoff: {
                    type: "exponential",
                    delay: 1000,
                },
            },
        });
        return this.queue;
    }
    async enqueue(eventType, payload) {
        const queue = await this.getQueue();
        if (!queue) {
            this.logger.warn("Queue unavailable, notification event skipped");
            return;
        }
        await queue.add(`notify:${eventType}`, {
            eventType,
            ...payload,
        });
    }
    async onModuleDestroy() {
        if (this.queue) {
            await this.queue.close();
        }
    }
};
exports.NotificationsQueue = NotificationsQueue;
exports.NotificationsQueue = NotificationsQueue = NotificationsQueue_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        redis_service_1.RedisService])
], NotificationsQueue);
//# sourceMappingURL=notifications.queue.js.map