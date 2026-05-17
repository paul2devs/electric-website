import { Injectable, NotFoundException } from "@nestjs/common";
import type { Technician } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { CreateTechnicianDto } from "./dto/create-technician.dto";
import { UpdateTechnicianDto } from "./dto/update-technician.dto";

export type TechnicianWithStats = Technician & {
  activeJobs: number;
};

@Injectable()
export class TechniciansService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<TechnicianWithStats[]> {
    const technicians = await this.prisma.technician.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        bookings: {
          select: { id: true },
          where: { status: { in: ["assigned", "in_progress"] } },
        },
      },
    });

    return technicians.map((tech) => ({
      id: tech.id,
      name: tech.name,
      phone: tech.phone,
      skills: tech.skills,
      status: tech.status,
      createdAt: tech.createdAt,
      activeJobs: tech.bookings.length,
    }));
  }

  async create(dto: CreateTechnicianDto): Promise<Technician> {
    return this.prisma.technician.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        skills: dto.skills.map((skill) => skill.trim()).filter(Boolean),
        status: dto.status,
      },
    });
  }

  async update(id: string, dto: UpdateTechnicianDto): Promise<Technician> {
    const existing = await this.prisma.technician.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Technician not found");
    }

    return this.prisma.technician.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
        ...(dto.skills !== undefined
          ? { skills: dto.skills.map((skill) => skill.trim()).filter(Boolean) }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
    });
  }
}
