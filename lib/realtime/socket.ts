import { io, type Socket } from "socket.io-client";

import { getApiBaseUrl } from "@/lib/constants/api";

let socket: Socket | null = null;

export function isRealtimeAvailable(): boolean {
  if (process.env.NEXT_PUBLIC_REALTIME_ENABLED === "false") {
    return false;
  }
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_REALTIME_ENABLED !== "true") {
    return false;
  }
  return true;
}

export function getRealtimeSocket(token: string): Socket | null {
  if (!isRealtimeAvailable()) {
    return null;
  }

  if (!socket) {
    socket = io(getApiBaseUrl(), {
      transports: ["websocket"],
      auth: { token },
    });
  } else if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
  return socket;
}

export function disconnectRealtimeSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
