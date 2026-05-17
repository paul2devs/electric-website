import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { shouldEnableRealtimeGateway, shouldRunNotificationWorker } from "../../config/deployment";
import { EventsModule } from "../events/events.module";
import { NotificationsController } from "./notifications.controller";
import { NotificationsEventsHandler } from "./notifications.events-handler";
import { NotificationsProcessor } from "./notifications.processor";
import { NotificationsQueue } from "./notifications.queue";
import { NotificationsService } from "./notifications.service";
import { EmailService } from "./email/email.service";
import { NotificationsGateway } from "./realtime/notifications.gateway";

const optionalProviders = [
  ...(shouldRunNotificationWorker() ? [NotificationsProcessor] : []),
  ...(shouldEnableRealtimeGateway() ? [NotificationsGateway] : []),
];

@Module({
  imports: [EventsModule, JwtModule.register({})],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsQueue,
    NotificationsEventsHandler,
    EmailService,
    ...optionalProviders,
  ],
  exports: [
    NotificationsService,
    EmailService,
    ...(shouldEnableRealtimeGateway() ? [NotificationsGateway] : []),
  ],
})
export class NotificationsModule {}
