import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { BookingsService, type BookingResponse } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { RescheduleBookingDto } from "./dto/reschedule-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";

@Controller("bookings")
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateBookingDto,
  ): Promise<BookingResponse> {
    return this.bookingsService.createBooking(req.user, dto);
  }

  @Get()
  async list(@Req() req: AuthRequest): Promise<BookingResponse[]> {
    return this.bookingsService.listForUser(req.user.id);
  }

  @Post(":id/cancel")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  async cancel(
    @Req() req: AuthRequest,
    @Param("id") id: string,
  ): Promise<BookingResponse> {
    return this.bookingsService.cancelForUser(req.user.id, id);
  }

  @Post(":id/reschedule")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  async reschedule(
    @Req() req: AuthRequest,
    @Param("id") id: string,
    @Body() dto: RescheduleBookingDto,
  ): Promise<BookingResponse> {
    return this.bookingsService.rescheduleForUser(req.user.id, id, dto);
  }

  @Get(":id")
  async detail(
    @Req() req: AuthRequest,
    @Param("id") id: string,
  ): Promise<BookingResponse> {
    return this.bookingsService.getForUser(req.user.id, id);
  }

  @Patch(":id/status")
  async updateStatus(
    @Req() req: AuthRequest,
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDto,
  ): Promise<BookingResponse> {
    return this.bookingsService.updateStatus(id, dto.status, req.user);
  }
}
