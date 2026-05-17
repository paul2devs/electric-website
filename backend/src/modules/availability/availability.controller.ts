import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { GetAvailabilityDto } from "./dto/get-availability.dto";
import { LockSlotDto } from "./dto/lock-slot.dto";
import { UnlockSlotDto } from "./dto/unlock-slot.dto";
import { AvailabilityService } from "./availability.service";

@Controller("availability")
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async list(@Query() query: GetAvailabilityDto): Promise<{ slots: string[] }> {
    const slots = await this.availabilityService.getAvailability(
      query.serviceId,
      query.date,
    );
    return { slots };
  }

  @Post("lock")
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async lock(
    @Body() body: LockSlotDto,
    @Req() req: AuthRequest,
  ): Promise<{ lockToken: string; expiresInSeconds: number }> {
    return this.availabilityService.lockSlot({
      serviceId: body.serviceId,
      date: body.date,
      time: body.time,
      userId: req.user.id,
    });
  }

  @Post("unlock")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlock(
    @Body() body: UnlockSlotDto,
  ): Promise<void> {
    await this.availabilityService.unlockSlot(body);
  }
}
