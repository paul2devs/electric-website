import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../../prisma/prisma.service";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

export type SafeUser = Omit<User, "password" | "isBlocked">;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
    };
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    phone: string;
  }): Promise<SafeUser> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.passwordHash,
        phone: data.phone.trim(),
      },
    });
    return this.toSafeUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone.trim() || null } : {}),
        ...(dto.address !== undefined ? { address: dto.address.trim() || null } : {}),
      },
    });
    return this.toSafeUser(user);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedException("Current password is invalid");
    }
    if (dto.currentPassword === dto.nextPassword) {
      throw new ConflictException("New password must be different");
    }
    const hash = await bcrypt.hash(dto.nextPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });
  }
}
