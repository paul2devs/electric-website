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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let NotificationsGateway = class NotificationsGateway {
    jwtService;
    config;
    server;
    constructor(jwtService, config) {
        this.jwtService = jwtService;
        this.config = config;
    }
    async handleConnection(client) {
        const token = this.extractToken(client);
        if (!token) {
            client.disconnect(true);
            return;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.config.getOrThrow("JWT_ACCESS_SECRET"),
            });
            client.data.userId = payload.sub;
            client.join(`user:${payload.sub}`);
            client.join(`role:${payload.role}`);
        }
        catch {
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        void client;
        return;
    }
    subscribeToUser(client, body) {
        if (client.data.userId === body.userId) {
            client.join(`user:${body.userId}`);
        }
    }
    emitToUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
    emitToAdmins(event, payload) {
        this.server.to("role:admin").emit(event, payload);
    }
    extractToken(client) {
        const authToken = typeof client.handshake.auth?.token === "string"
            ? client.handshake.auth.token
            : null;
        if (authToken) {
            return authToken;
        }
        const header = client.handshake.headers.authorization;
        if (typeof header !== "string") {
            return null;
        }
        const [type, token] = header.split(" ");
        if (type !== "Bearer" || !token) {
            return null;
        }
        return token;
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("notifications:subscribe"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "subscribeToUser", null);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map