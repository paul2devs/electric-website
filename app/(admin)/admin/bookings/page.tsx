"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ActionMenu } from "@/components/admin/action-menu";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { DrawerPanel } from "@/components/admin/drawer-panel";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  assignAdminTechnician,
  fetchAdminBookings,
  fetchAdminTechnicians,
  updateAdminBooking,
} from "@/lib/admin/api";
import type { AdminBooking, AdminTechnician } from "@/lib/admin/types";
import { routes } from "@/lib/constants/routes";
import { formatNgn } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [technicians, setTechnicians] = useState<AdminTechnician[]>([]);
  const [selected, setSelected] = useState<AdminBooking | null>(null);

  const load = async () => {
    const [bookingData, techData] = await Promise.all([
      fetchAdminBookings(),
      fetchAdminTechnicians(),
    ]);
    setBookings(bookingData);
    setTechnicians(techData);
  };

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, []);

  const technicianOptions = useMemo(
    () => technicians.map((tech) => ({ id: tech.id, label: tech.name })),
    [technicians],
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Bookings Operations" subtitle="Real-time booking management" />

      <AdminTable
        headers={["Client", "Service", "Date", "Status", "Assigned Tech", "Actions"]}
        minWidthClass="min-w-[980px]"
      >
        {bookings.map((booking) => (
          <tr key={booking.id} className="border-b border-border">
            <td className="py-3 pr-4 text-small text-ink">{booking.user.name}</td>
            <td className="py-3 pr-4 text-small text-muted">{booking.service.name}</td>
            <td className="py-3 pr-4 text-small text-muted">{booking.date} {booking.time}</td>
            <td className="py-3 pr-4"><AdminStatusBadge status={booking.status} /></td>
            <td className="py-3 pr-4 text-small text-muted">{booking.technician?.name ?? "Unassigned"}</td>
            <td className="py-3 text-small">
              <ActionMenu
                actions={[
                  { label: "Assign", onClick: () => setSelected(booking) },
                  { label: "View", onClick: () => setSelected(booking) },
                ]}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <DrawerPanel
        open={selected !== null}
        title="Booking details"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4 text-small text-muted">
            <p><span className="text-ink font-medium">Client:</span> {selected.user.name}</p>
            <p><span className="text-ink font-medium">Service:</span> {selected.service.name}</p>
            <p><span className="text-ink font-medium">Address:</span> {selected.address}</p>
            <p><span className="text-ink font-medium">Pricing:</span> {formatNgn(selected.price)}</p>
            <div className="space-y-2">
              <p className="text-ink font-medium">Update status</p>
              <div className="flex flex-wrap gap-2">
                {["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled"].map((status) => (
                  <Button
                    key={status}
                    variant="secondary"
                    onClick={async () => {
                      await updateAdminBooking(selected.id, { status });
                      await load();
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-ink font-medium">Assign technician</p>
              <div className="flex flex-wrap gap-2">
                {technicianOptions.map((tech) => (
                  <Button
                    key={tech.id}
                    variant="secondary"
                    onClick={async () => {
                      await assignAdminTechnician({ bookingId: selected.id, technicianId: tech.id });
                      await load();
                    }}
                  >
                    {tech.label}
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await assignAdminTechnician({ bookingId: selected.id });
                    await load();
                  }}
                >
                  Unassign
                </Button>
              </div>
            </div>
            <Link href={routes.adminBookingDetail(selected.id)} className="font-medium underline">
              Open full details page
            </Link>
          </div>
        ) : null}
      </DrawerPanel>
    </div>
  );
}
