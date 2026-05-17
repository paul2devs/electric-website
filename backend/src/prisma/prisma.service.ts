import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { isServerlessRuntime } from "../config/deployment";

const globalForPrisma = globalThis as {
  prisma?: PrismaService;
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  static create(): PrismaService {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaService();
    }
    return globalForPrisma.prisma;
  }

  constructor() {
    super({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    if (!isServerlessRuntime()) {
      await this.$disconnect();
    }
  }
}
