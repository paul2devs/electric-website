import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { AdminGuard } from "../auth/guards/admin.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateTechnicianDto } from "../technicians/dto/create-technician.dto";
import { UpdateTechnicianDto } from "../technicians/dto/update-technician.dto";
import { TechniciansService } from "../technicians/technicians.service";
import { FeedbackStatus } from "@prisma/client";

import { UpdateFeedbackStatusDto } from "../feedback/dto/update-feedback-status.dto";
import { FeedbackService } from "../feedback/feedback.service";
import { AdminAssignTechnicianDto } from "./dto/admin-assign-technician.dto";
import { AdminServiceUpsertDto } from "./dto/admin-service-upsert.dto";
import { AdminUpdateBookingDto } from "./dto/admin-update-booking.dto";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly techniciansService: TechniciansService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Get()
  async overview() {
    return this.adminService.overview();
  }

  @Get("bookings")
  async bookings() {
    return this.adminService.listBookings();
  }

  @Get("bookings/:id")
  async bookingDetail(@Param("id") id: string) {
    return this.adminService.getBooking(id);
  }

  @Patch("bookings/:id")
  async updateBooking(
    @Param("id") id: string,
    @Body() dto: AdminUpdateBookingDto,
  ) {
    return this.adminService.updateBooking(id, dto);
  }

  @Post("assign-technician")
  async assignTechnician(@Body() dto: AdminAssignTechnicianDto) {
    return this.adminService.assignTechnician(dto);
  }

  @Get("services")
  async services() {
    return this.adminService.listServices();
  }

  @Post("services")
  async createService(@Body() dto: AdminServiceUpsertDto) {
    return this.adminService.createService(dto);
  }

  @Patch("services/:id")
  async updateService(@Param("id") id: string, @Body() dto: AdminServiceUpsertDto) {
    return this.adminService.updateService(id, dto);
  }

  @Delete("services/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteService(@Param("id") id: string): Promise<void> {
    await this.adminService.deleteService(id);
  }

  @Get("users")
  async users() {
    return this.adminService.listUsers();
  }

  @Patch("users/:id/block")
  async blockUser(
    @Param("id") id: string,
    @Query("block") block: string,
  ) {
    return this.adminService.blockUser(id, block === "true");
  }

  @Get("technicians")
  async technicians() {
    return this.techniciansService.list();
  }

  @Post("technicians")
  async createTechnician(@Body() dto: CreateTechnicianDto) {
    return this.techniciansService.create(dto);
  }

  @Patch("technicians/:id")
  async updateTechnician(
    @Param("id") id: string,
    @Body() dto: UpdateTechnicianDto,
  ) {
    return this.techniciansService.update(id, dto);
  }

  @Get("analytics")
  async analytics() {
    return this.adminService.analytics();
  }

  @Get("feedback")
  async feedback(@Query("status") status?: FeedbackStatus) {
    return this.feedbackService.listForAdmin(status);
  }

  @Patch("feedback/:id")
  async updateFeedbackStatus(
    @Param("id") id: string,
    @Body() dto: UpdateFeedbackStatusDto,
  ) {
    return this.feedbackService.updateStatus(id, dto.status);
  }
}
