import { Injectable, NotFoundException } from "@nestjs/common";
import { FeedbackStatus } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";

type AuthUser = { id: string };

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto, authUser: AuthUser | null) {
    return this.prisma.feedback.create({
      data: {
        message: dto.message.trim(),
        name: dto.name?.trim() || null,
        email: dto.email?.trim().toLowerCase() || null,
        userId: authUser?.id ?? null,
      },
    });
  }

  async listForAdmin(status?: FeedbackStatus) {
    return this.prisma.feedback.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });
  }

  async updateStatus(id: string, status: FeedbackStatus) {
    const existing = await this.prisma.feedback.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Feedback not found");
    }
    return this.prisma.feedback.update({
      where: { id },
      data: { status },
    });
  }
}
