"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const deployment_1 = require("../../config/deployment");
const events_module_1 = require("../events/events.module");
const notifications_controller_1 = require("./notifications.controller");
const notifications_events_handler_1 = require("./notifications.events-handler");
const notifications_processor_1 = require("./notifications.processor");
const notifications_queue_1 = require("./notifications.queue");
const notifications_service_1 = require("./notifications.service");
const email_service_1 = require("./email/email.service");
const notifications_gateway_1 = require("./realtime/notifications.gateway");
const optionalProviders = [
    ...((0, deployment_1.shouldRunNotificationWorker)() ? [notifications_processor_1.NotificationsProcessor] : []),
    ...((0, deployment_1.shouldEnableRealtimeGateway)() ? [notifications_gateway_1.NotificationsGateway] : []),
];
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [events_module_1.EventsModule, jwt_1.JwtModule.register({})],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notifications_service_1.NotificationsService,
            notifications_queue_1.NotificationsQueue,
            notifications_events_handler_1.NotificationsEventsHandler,
            email_service_1.EmailService,
            ...optionalProviders,
        ],
        exports: [
            notifications_service_1.NotificationsService,
            email_service_1.EmailService,
            ...((0, deployment_1.shouldEnableRealtimeGateway)() ? [notifications_gateway_1.NotificationsGateway] : []),
        ],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map