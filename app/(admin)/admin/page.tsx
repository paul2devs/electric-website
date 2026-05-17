"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MetricsCard } from "@/components/admin/metrics-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { fetchAdminOverview } from "@/lib/admin/api";
import type { AdminOverview } from "@/lib/admin/types";
import { getAccessToken } from "@/lib/auth/access-token";
import { routes } from "@/lib/constants/routes";
import { getRealtimeSocket } from "@/lib/realtime/socket";
import { formatNgn } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await fetchAdminOverview();
      if (active) {
        setOverview(data);
      }
    };
    void load();

    const token = getAccessToken();
    const socket = token ? getRealtimeSocket(token) : null;
    if (socket) {
      const refresh = () => {
        if (active) {
          void load();
        }
      };
      socket.on("booking_status_changed", refresh);
      socket.on("technician_assigned", refresh);
      return () => {
        active = false;
        socket.off("booking_status_changed", refresh);
        socket.off("technician_assigned", refresh);
      };
    }

    return () => {
      active = false;
    };
  }, []);

  if (!overview) {
    return <p className="text-small text-muted">Loading admin overview</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="Admin Dashboard" subtitle="Operational control center" />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <MetricsCard label="Total Revenue" value={formatNgn(overview.metrics.totalRevenue)} />
        <MetricsCard label="Total Bookings" value={String(overview.metrics.totalBookings)} />
        <MetricsCard label="Pending Jobs" value={String(overview.metrics.pendingJobs)} />
        <MetricsCard label="Completed Jobs" value={String(overview.metrics.completedJobs)} />
        <MetricsCard label="Active Technicians" value={String(overview.metrics.activeTechnicians)} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Live Activity" />
        <ul className="border-t border-border">
          {overview.activity.map((item) => (
            <li key={item.id} className="border-b border-border py-3 text-small text-muted">
              {item.serviceId} · {item.status} · {new Date(item.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link className="text-small font-medium underline" href={routes.adminServices}>
          Create service
        </Link>
        <Link className="text-small font-medium underline" href={routes.adminBookings}>
          View pending bookings
        </Link>
      </section>
    </div>
  );
}
