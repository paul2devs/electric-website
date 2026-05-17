import { Module } from "@nestjs/common";

import { EventsModule } from "../events/events.module";
import { FeedbackModule } from "../feedback/feedback.module";
import { TechniciansModule } from "../technicians/technicians.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [TechniciansModule, EventsModule, FeedbackModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
