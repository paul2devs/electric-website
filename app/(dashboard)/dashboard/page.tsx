"use client";

import { useEffect, useMemo, useState } from "react";

import { BookingRow } from "@/components/dashboard/booking-row";
import { DashboardFeedbackSection } from "@/components/dashboard/dashboard-feedback-section";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { fetchDashboardBookings, buildStats } from "@/lib/dashboard/api";
import type { DashboardBooking } from "@/lib/dashboard/types";
import { getAccessToken } from "@/lib/auth/access-token";
import { routes } from "@/lib/constants/routes";
import { getRealtimeSocket } from "@/lib/realtime/socket";
import { formatNgn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchDashboardBookings();
        if (active) {
          setBookings(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
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
      socket.on("booking_updated", refresh);
      socket.on("booking_status_changed", refresh);
      return () => {
        active = false;
        socket.off("booking_updated", refresh);
        socket.off("booking_status_changed", refresh);
      };
    }

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => buildStats(bookings), [bookings]);
  const upcoming = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((booking) => new Date(`${booking.date}T${booking.time}:00.000Z`) > now)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0] ?? null;
  }, [bookings]);

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader title={`Welcome back, ${user?.name ?? "User"}`} />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={String(stats.totalBookings)} />
        <StatCard label="Completed Services" value={String(stats.completedServices)} />
        <StatCard label="Upcoming Jobs" value={String(stats.upcomingJobs)} />
        <StatCard label="Total Spent" value={formatNgn(stats.totalSpent)} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Upcoming booking" />
        {upcoming ? (
          <div className="rounded-sm border border-border bg-surface p-4 text-small text-muted">
            <p className="font-medium text-ink">{upcoming.serviceName ?? upcoming.serviceId}</p>
            <p className="mt-1">
              {upcoming.date} · {upcoming.time} · {upcoming.status}
            </p>
          </div>
        ) : (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4M16 2v4M3 9h18" />
              </svg>
            }
            title="No upcoming bookings yet"
            description="As soon as you confirm a new booking, it appears here with scheduling details."
            ctaLabel="Book a service"
            ctaHref={routes.book}
          />
        )}
      </section>

      <DashboardFeedbackSection />

      <section className="flex flex-col gap-4">
        <SectionHeader title="Recent activity" />
        {loading ? (
          <p className="text-small text-muted">Loading activity</p>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
            title="No recent activity"
            description="Booking updates and service progress will appear here once your workflow starts."
            ctaLabel="Book a service"
            ctaHref={routes.book}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-t border-border">
              <thead>
                <tr className="border-b border-border text-left text-small text-muted">
                  <th className="py-3 pr-4 font-medium">Service</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Price</th>
                  <th className="py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
