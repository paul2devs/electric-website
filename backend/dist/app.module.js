"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const admin_module_1 = require("./modules/admin/admin.module");
const auth_module_1 = require("./modules/auth/auth.module");
const health_module_1 = require("./modules/health/health.module");
const availability_module_1 = require("./modules/availability/availability.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const events_module_1 = require("./modules/events/events.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const pricing_module_1 = require("./modules/pricing/pricing.module");
const services_module_1 = require("./modules/services/services.module");
const technicians_module_1 = require("./modules/technicians/technicians.module");
const users_module_1 = require("./modules/users/users.module");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 80,
                },
            ]),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            redis_module_1.RedisModule,
            events_module_1.EventsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            services_module_1.ServicesModule,
            pricing_module_1.PricingModule,
            availability_module_1.AvailabilityModule,
            bookings_module_1.BookingsModule,
            invoices_module_1.InvoicesModule,
            technicians_module_1.TechniciansModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            feedback_module_1.FeedbackModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map