import { Module } from "@nestjs/common";

import { AvailabilityModule } from "../availability/availability.module";
import { EventsModule } from "../events/events.module";
import { PricingModule } from "../pricing/pricing.module";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";

@Module({
  imports: [AvailabilityModule, PricingModule, EventsModule],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
