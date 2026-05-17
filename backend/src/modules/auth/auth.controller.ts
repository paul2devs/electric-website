import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";

import type { SafeUser } from "../users/users.service";
import {
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_MS,
  refreshCookieOptions,
} from "./constants/cookie";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { AuthRequest } from "./interfaces/auth-request.interface";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<{ user: SafeUser }> {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; user: SafeUser }> {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);
    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      refreshCookieOptions(REFRESH_TOKEN_MS),
    );
    return { accessToken, user };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request): Promise<{ accessToken: string }> {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    const result = await this.authService.refresh(token);
    return result;
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
    });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthRequest): SafeUser {
    return req.user;
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    await this.authService.forgotPassword(dto);
    return {
      message: "If your email exists, a password reset link has been sent.",
    };
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(dto);
    return { message: "Password has been reset successfully." };
  }
}
