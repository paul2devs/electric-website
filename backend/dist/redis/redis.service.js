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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = class RedisService {
    config;
    client;
    constructor(config) {
        this.config = config;
        const url = config.get("REDIS_URL");
        if (url) {
            this.client = new ioredis_1.default(url, {
                maxRetriesPerRequest: null,
                lazyConnect: true,
                enableReadyCheck: false,
            });
        }
        else {
            this.client = null;
        }
    }
    getClient() {
        return this.client;
    }
    async ping() {
        const client = await this.getConnectedClient();
        if (!client) {
            return false;
        }
        try {
            const result = await client.ping();
            return result === "PONG";
        }
        catch {
            return false;
        }
    }
    async getConnectedClient() {
        if (!this.client) {
            return null;
        }
        if (this.client.status === "ready") {
            return this.client;
        }
        try {
            await this.client.connect();
            return this.client;
        }
        catch {
            return null;
        }
    }
    async onModuleDestroy() {
        if (this.client && this.client.status !== "end") {
            await this.client.quit();
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map