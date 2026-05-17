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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsEventsHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_types_1 = require("../events/constants/event-types");
const notifications_queue_1 = require("./notifications.queue");
let NotificationsEventsHandler = class NotificationsEventsHandler {
    notificationsQueue;
    constructor(notificationsQueue) {
        this.notificationsQueue = notificationsQueue;
    }
    async onBookingCreated(payload) {
        await this.notificationsQueue.enqueue(event_types_1.domainEventTypes.BOOKING_CREATED, payload);
    }
    async onBookingRescheduled(payload) {
        await this.notificationsQueue.enqueue(event_types_1.domainEventTypes.BOOKING_RESCHEDULED, payload);
    }
    async onBookingConfirmed(payload) {
        await this.notificationsQueue.enqueue(event_types_1.domainEventTypes.BOOKING_CONFIRMED, payload);
    }
    async onTechnicianAssigned(payload) {
        await this.notificationsQueue.enqueue(event_types_1.domainEventTypes.TECHNICIAN_ASSIGNED, payload);
    }
    async onBookingStarted(payload) {
        await this.notificationsQueue.enqueue(event_types_1.domainEventTypes.BOOKING_STARTED, payload);
    }
    async onBookingCompleted(payload) {
        await this.notificationsQueue.enqueue(event_types_1.domainEventTypes.BOOKING_COMPLETED, payload);
    }
    async onBookingCancelled(payload) {
        await this.notificationsQueue.enqueue(event_types_1.domainEventTypes.BOOKING_CANCELLED, payload);
    }
};
exports.NotificationsEventsHandler = NotificationsEventsHandler;
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.domainEventTypes.BOOKING_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsEventsHandler.prototype, "onBookingCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.domainEventTypes.BOOKING_RESCHEDULED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsEventsHandler.prototype, "onBookingRescheduled", null);
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.domainEventTypes.BOOKING_CONFIRMED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsEventsHandler.prototype, "onBookingConfirmed", null);
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.domainEventTypes.TECHNICIAN_ASSIGNED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsEventsHandler.prototype, "onTechnicianAssigned", null);
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.domainEventTypes.BOOKING_STARTED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsEventsHandler.prototype, "onBookingStarted", null);
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.domainEventTypes.BOOKING_COMPLETED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsEventsHandler.prototype, "onBookingCompleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.domainEventTypes.BOOKING_CANCELLED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsEventsHandler.prototype, "onBookingCancelled", null);
exports.NotificationsEventsHandler = NotificationsEventsHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_queue_1.NotificationsQueue])
], NotificationsEventsHandler);
//# sourceMappingURL=notifications.events-handler.js.map