import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";

@Module({
  imports: [AuthModule],
  providers: [FeedbackService, OptionalJwtAuthGuard],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {}
