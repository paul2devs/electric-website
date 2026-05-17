import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";

import { getFrontendOrigin } from "../../config/deployment";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailService } from "../notifications/email/email.service";
import { UsersService, type SafeUser } from "../users/users.service";
import type { JwtPayload } from "./interfaces/jwt-payload.interface";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: SafeUser }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      name: dto.name.trim(),
      email: dto.email,
      passwordHash,
      phone: dto.phone.trim(),
    });
    return { user };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: SafeUser }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || user.isBlocked) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const safe = this.usersService.toSafeUser(user);
    const accessToken = this.signAccess(safe);
    const refreshToken = await this.signRefresh(safe);
    return { accessToken, refreshToken, user: safe };
  }

  async refresh(
    refreshToken: string | undefined,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.getRefreshSecret(),
        },
      );
      const user = await this.usersService.findById(payload.sub);
      if (!user || user.isBlocked) {
        throw new UnauthorizedException();
      }
      const safe = this.usersService.toSafeUser(user);
      return { accessToken: this.signAccess(safe) };
    } catch {
      throw new UnauthorizedException();
    }
  }

  signAccess(user: SafeUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private signRefresh(user: SafeUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: "7d",
    });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || user.isBlocked) {
      return;
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashResetToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const resetLink = `${getFrontendOrigin()}/reset-password?token=${token}`;

    await this.emailService.send({
      to: user.email,
      subject: "Reset your Testimonydot password",
      html: `<p>You requested a password reset.</p><p>Use the link below to set a new password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`,
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = this.hashResetToken(dto.token);
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetToken) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: passwordHash },
      }),
      this.prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);
  }

  private hashResetToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private getRefreshSecret(): string {
    return (
      this.config.get<string>("JWT_REFRESH_SECRET") ??
      this.config.getOrThrow<string>("JWT_ACCESS_SECRET")
    );
  }
}
