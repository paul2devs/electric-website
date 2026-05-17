import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Server, Socket } from "socket.io";
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly config;
    server: Server;
    constructor(jwtService: JwtService, config: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    subscribeToUser(client: Socket, body: {
        userId: string;
    }): void;
    emitToUser(userId: string, event: string, payload: Record<string, unknown>): void;
    emitToAdmins(event: string, payload: Record<string, unknown>): void;
    private extractToken;
}
