import { Controller, Get } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth(): Promise<{
    ok: boolean;
    database: boolean;
    timestamp: string;
  }> {
    let database = false;
    try {
      await this.prisma.$queryRaw(Prisma.sql`SELECT 1`);
      database = true;
    } catch {
      database = false;
    }
    return {
      ok: database,
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
