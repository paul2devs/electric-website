import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import type { DashboardBooking } from "@/lib/dashboard/types";
import { routes } from "@/lib/constants/routes";
import { formatNgn } from "@/lib/utils";

type BookingRowProps = {
  booking: DashboardBooking;
};

export function BookingRow({ booking }: BookingRowProps) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="py-3 pr-4 text-small text-ink">
        {booking.serviceName ?? booking.serviceId}
      </td>
      <td className="py-3 pr-4 text-small text-muted">
        {booking.date} · {booking.time}
      </td>
      <td className="py-3 pr-4">
        <StatusBadge status={booking.status} />
      </td>
      <td className="py-3 pr-4 text-small text-ink">{formatNgn(booking.pricing.total)}</td>
      <td className="py-3 text-small">
        <Link className="font-medium underline" href={routes.dashboardBookingDetail(booking.id)}>
          View details
        </Link>
      </td>
    </tr>
  );
}
