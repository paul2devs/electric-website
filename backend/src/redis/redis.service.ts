import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis | null;

  constructor(private readonly config: ConfigService) {
    const url = config.get<string>("REDIS_URL");
    if (url) {
      this.client = new Redis(url, {
        maxRetriesPerRequest: null,
        lazyConnect: true,
        enableReadyCheck: false,
      });
    } else {
      this.client = null;
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  async ping(): Promise<boolean> {
    const client = await this.getConnectedClient();
    if (!client) {
      return false;
    }
    try {
      const result = await client.ping();
      return result === "PONG";
    } catch {
      return false;
    }
  }

  async getConnectedClient(): Promise<Redis | null> {
    if (!this.client) {
      return null;
    }
    if (this.client.status === "ready") {
      return this.client;
    }
    try {
      await this.client.connect();
      return this.client;
    } catch {
      return null;
    }
  }

  async onModuleDestroy() {
    if (this.client && this.client.status !== "end") {
      await this.client.quit();
    }
  }
}
