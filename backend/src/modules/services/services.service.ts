import { Injectable } from "@nestjs/common";
import type { AddOn, Service } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";

export type ServiceWithAddOns = Service & {
  addOns: AddOn[];
};

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<ServiceWithAddOns[]> {
    return this.prisma.service.findMany({
      include: { addOns: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  }

  async findById(serviceId: string): Promise<ServiceWithAddOns | null> {
    return this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { addOns: true },
    });
  }
}
