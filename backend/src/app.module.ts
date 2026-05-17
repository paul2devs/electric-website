import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { AdminModule } from "./modules/admin/admin.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { EventsModule } from "./modules/events/events.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PricingModule } from "./modules/pricing/pricing.module";
import { ServicesModule } from "./modules/services/services.module";
import { TechniciansModule } from "./modules/technicians/technicians.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 80,
      },
    ]),
    PrismaModule,
    HealthModule,
    RedisModule,
    EventsModule,
    UsersModule,
    AuthModule,
    ServicesModule,
    PricingModule,
    AvailabilityModule,
    BookingsModule,
    InvoicesModule,
    TechniciansModule,
    NotificationsModule,
    AdminModule,
    FeedbackModule,
  ],
})
export class AppModule {}
