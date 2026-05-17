import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService, type SafeUser } from "./users.service";

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  profile(@Req() req: AuthRequest): SafeUser {
    return req.user;
  }

  @Patch("profile")
  async updateProfile(
    @Req() req: AuthRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<SafeUser> {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Patch("password")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Req() req: AuthRequest,
    @Body() dto: UpdatePasswordDto,
  ): Promise<void> {
    await this.usersService.updatePassword(req.user.id, dto);
  }
}
