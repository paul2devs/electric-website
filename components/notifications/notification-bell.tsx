"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { fetchNotifications, markNotificationRead } from "@/lib/notifications/api";
import type { AppNotification } from "@/lib/notifications/types";
import { getAccessToken } from "@/lib/auth/access-token";
import { getRealtimeSocket } from "@/lib/realtime/socket";

export function NotificationBell() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    const data = await fetchNotifications();
    setItems(data.items);
    setUnreadCount(data.unreadCount);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchNotifications();
      if (!mounted) {
        return;
      }
      setItems(data.items);
      setUnreadCount(data.unreadCount);
    })();

    const token = getAccessToken();
    if (!token) {
      return () => {
        mounted = false;
      };
    }

    const socket = getRealtimeSocket(token);
    if (!socket) {
      return () => {
        mounted = false;
      };
    }

    const onBookingUpdated = (payload: {
      notification?: AppNotification;
    }) => {
      if (payload.notification) {
        setItems((prev) => [payload.notification!, ...prev].slice(0, 40));
        setUnreadCount((prev) => prev + 1);
      } else {
        void load();
      }
    };

    socket.on("booking_updated", onBookingUpdated);

    return () => {
      mounted = false;
      socket.off("booking_updated", onBookingUpdated);
    };
  }, []);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!open) {
        return;
      }
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const unreadItems = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const visibleItems = useMemo(() => {
    const map = new Map<string, AppNotification>();
    for (const item of items) {
      const key = `${item.type}:${item.message}`;
      const existing = map.get(key);
      if (
        !existing ||
        new Date(item.createdAt).getTime() > new Date(existing.createdAt).getTime()
      ) {
        map.set(key, item);
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [items]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:bg-hover hover:text-ink"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 18H9" />
          <path d="M18 14V11a6 6 0 1 0-12 0v3l-2 2h16z" />
        </svg>
        {unreadItems > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-surface">
            {unreadItems}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-3 w-[min(100vw-2rem,22rem)] rounded-sm border border-border bg-surface p-4 shadow-lg">
          <p className="mb-3 text-small font-semibold text-ink">Notifications · {unreadCount} unread</p>
          <ul className="max-h-72 overflow-y-auto border-t border-border">
            {visibleItems.length === 0 ? (
              <li className="py-4 text-small font-medium text-muted">No notifications</li>
            ) : (
              visibleItems.map((item) => (
                <li
                  key={item.id}
                  className={`border-b border-border py-3 last:border-b-0 ${
                    item.read ? "opacity-75" : ""
                  }`}
                >
                  <p className="text-small font-semibold leading-snug text-ink">{item.message}</p>
                  <p className="mt-2 text-[11px] font-medium tabular-nums text-muted">
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {!item.read ? (
                    <button
                      type="button"
                      className="mt-2 text-small font-semibold text-accent hover:text-accent-hover"
                      onClick={async () => {
                        const updated = await markNotificationRead(item.id, true);
                        setItems((prev) =>
                          prev.map((entry) => (entry.id === updated.id ? updated : entry)),
                        );
                        setUnreadCount((prev) => Math.max(0, prev - 1));
                      }}
                    >
                      Mark as read
                    </button>
                  ) : (
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted">
                      Read
                    </p>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
