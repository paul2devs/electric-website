"use client";

import { useEffect, useState } from "react";

import { BookingRow } from "@/components/dashboard/booking-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/constants/routes";
import { fetchDashboardBookings } from "@/lib/dashboard/api";
import type { DashboardBooking } from "@/lib/dashboard/types";

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
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
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Bookings" subtitle="Track and manage your service bookings." />
      {loading ? (
        <p className="text-small text-muted">Loading bookings</p>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M8 2v4M16 2v4M3 9h18" />
            </svg>
          }
          title="No bookings yet"
          description="Create your first booking to start tracking jobs and technician progress."
          ctaLabel="Book a service"
          ctaHref={routes.book}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-t border-border">
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
              {bookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
