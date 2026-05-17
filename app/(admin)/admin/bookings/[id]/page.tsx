"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { SectionHeader } from "@/components/dashboard/section-header";
import { fetchAdminBooking } from "@/lib/admin/api";
import type { AdminBooking } from "@/lib/admin/types";
import { ApiError } from "@/lib/api/errors";
import { formatNgn } from "@/lib/utils";

function adminBookingIdFromParams(params: { id?: string | string[] }): string {
  const raw = params?.id;
  if (typeof raw === "string") {
    return raw;
  }
  if (Array.isArray(raw) && raw[0]) {
    return raw[0];
  }
  return "";
}

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = adminBookingIdFromParams(params);

  const [phase, setPhase] = useState<"loading" | "ready" | "missing">("loading");
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!id) {
      queueMicrotask(() => {
        setPhase("missing");
        setBooking(null);
        setErrorMessage("Invalid booking reference.");
      });
      return () => {
        active = false;
      };
    }

    queueMicrotask(() => {
      setPhase("loading");
      setErrorMessage(null);
    });

    (async () => {
      try {
        const data = await fetchAdminBooking(id);
        if (!active) {
          return;
        }
        setBooking(data);
        setPhase("ready");
      } catch (err) {
        if (!active) {
          return;
        }
        setBooking(null);
        setPhase("missing");
        setErrorMessage(
          err instanceof ApiError ? err.message : "Unable to load booking.",
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  if (phase === "loading") {
    return <p className="text-small font-medium text-muted">Loading booking</p>;
  }

  if (phase === "missing" || !booking) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-small font-semibold text-error" role="alert">
          {errorMessage ?? "Booking not found."}
        </p>
        <p className="text-small font-medium text-muted">
          Confirm the booking identifier in the URL and try again. If the operations list
          loads but this page does not, verify the API is reachable and your database is
          running.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <SectionHeader title={`Booking ${booking.id.slice(0, 8)}`} subtitle="Operations detail view" />
        <AdminStatusBadge status={booking.status} />
      </div>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 text-small font-medium text-muted">
          <p>
            <span className="text-ink">Client:</span> {booking.user.name}
          </p>
          <p>
            <span className="text-ink">Email:</span> {booking.user.email}
          </p>
          <p>
            <span className="text-ink">Account phone:</span> {booking.user.phone ?? "—"}
          </p>
          <p>
            <span className="text-ink">Service:</span> {booking.service.name}
          </p>
          <p>
            <span className="text-ink">Date & Time:</span> {booking.date} {booking.time}
          </p>
          <p>
            <span className="text-ink">Site address:</span> {booking.address}
          </p>
          <p>
            <span className="text-ink">Booking phone:</span> {booking.phone}
          </p>
          <p>
            <span className="text-ink">Technician:</span> {booking.technician?.name ?? "Unassigned"}
          </p>
          <p>
            <span className="text-ink">Notes:</span> {booking.notes || "No notes"}
          </p>
        </div>

        <div className="space-y-2 text-small font-medium text-muted">
          <p>
            <span className="text-ink">Base:</span> {formatNgn(booking.baseAmount)}
          </p>
          <p>
            <span className="text-ink">Urgency:</span> {formatNgn(booking.urgencyFee)}
          </p>
          <p>
            <span className="text-ink">Distance:</span> {formatNgn(booking.distanceFee)}
          </p>
          <p>
            <span className="text-ink">Add-ons:</span> {formatNgn(booking.addonsFee)}
          </p>
          <p className="font-semibold text-ink">Total: {formatNgn(booking.price)}</p>
        </div>
      </section>
    </div>
  );
}
