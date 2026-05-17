import { OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
export declare class RedisService implements OnModuleDestroy {
    private readonly config;
    private readonly client;
    constructor(config: ConfigService);
    getClient(): Redis | null;
    ping(): Promise<boolean>;
    getConnectedClient(): Promise<Redis | null>;
    onModuleDestroy(): Promise<void>;
}
