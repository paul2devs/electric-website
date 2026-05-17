import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Server, Socket } from "socket.io";

import type { JwtPayload } from "../../auth/interfaces/jwt-payload.interface";

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
      });
      client.data.userId = payload.sub;
      client.join(`user:${payload.sub}`);
      client.join(`role:${payload.role}`);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    void client;
    return;
  }

  @SubscribeMessage("notifications:subscribe")
  subscribeToUser(@ConnectedSocket() client: Socket, @MessageBody() body: { userId: string }): void {
    if (client.data.userId === body.userId) {
      client.join(`user:${body.userId}`);
    }
  }

  emitToUser(userId: string, event: string, payload: Record<string, unknown>): void {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  emitToAdmins(event: string, payload: Record<string, unknown>): void {
    this.server.to("role:admin").emit(event, payload);
  }

  private extractToken(client: Socket): string | null {
    const authToken =
      typeof client.handshake.auth?.token === "string"
        ? client.handshake.auth.token
        : null;
    if (authToken) {
      return authToken;
    }

    const header = client.handshake.headers.authorization;
    if (typeof header !== "string") {
      return null;
    }
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return null;
    }
    return token;
  }
}
