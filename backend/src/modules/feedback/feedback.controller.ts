import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";

import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";

type RequestWithUser = {
  user?: { id: string };
};

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async create(@Body() dto: CreateFeedbackDto, @Req() req: RequestWithUser) {
    const record = await this.feedbackService.create(dto, req.user ?? null);
    return {
      id: record.id,
      message: "Thank you. Your feedback has been received.",
    };
  }
}
