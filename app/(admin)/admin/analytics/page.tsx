"use client";

import { useEffect, useState } from "react";

import { AdminTable } from "@/components/admin/admin-table";
import { MetricsCard } from "@/components/admin/metrics-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { fetchAdminAnalytics } from "@/lib/admin/api";
import type { AdminAnalytics } from "@/lib/admin/types";
import { formatNgn } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchAdminAnalytics();
      if (active) {
        setAnalytics(data);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!analytics) {
    return <p className="text-small text-muted">Loading analytics</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="Analytics" subtitle="Revenue and operations insights" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard label="Total Revenue" value={formatNgn(analytics.totalRevenue)} />
        <MetricsCard label="Monthly Points" value={String(analytics.monthlyRevenue.length)} />
        <MetricsCard label="Popular Services" value={String(analytics.popularServices.length)} />
        <MetricsCard label="Peak Slots" value={String(analytics.peakBookingTimes.length)} />
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeader title="Revenue Over Time" />
          <AdminTable headers={["Month", "Revenue"]} minWidthClass="min-w-[360px]">
            {analytics.monthlyRevenue.map((row) => (
              <tr key={row.month} className="border-b border-border">
                <td className="py-3 pr-4 text-small text-muted">{row.month}</td>
                <td className="py-3 text-small text-ink">{formatNgn(row.value)}</td>
              </tr>
            ))}
          </AdminTable>
        </div>

        <div>
          <SectionHeader title="Services Popularity" />
          <AdminTable headers={["Service", "Bookings"]} minWidthClass="min-w-[360px]">
            {analytics.popularServices.map((row) => (
              <tr key={row.serviceId} className="border-b border-border">
                <td className="py-3 pr-4 text-small text-muted">{row.name}</td>
                <td className="py-3 text-small text-ink">{row.count}</td>
              </tr>
            ))}
          </AdminTable>
        </div>
      </section>
    </div>
  );
}
