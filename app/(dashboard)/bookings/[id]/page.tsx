"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PricingPanel } from "@/components/booking/pricing-panel";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRescheduleFlow } from "@/hooks/use-reschedule-flow";
import { ApiError } from "@/lib/api/errors";
import {
  cancelDashboardBooking,
  fetchDashboardBooking,
} from "@/lib/dashboard/api";
import type { DashboardBooking } from "@/lib/dashboard/types";
import { formatNgn } from "@/lib/utils";

function bookingIdFromParams(params: { id?: string | string[] }): string {
  const raw = params?.id;
  if (typeof raw === "string") {
    return raw;
  }
  if (Array.isArray(raw) && raw[0]) {
    return raw[0];
  }
  return "";
}

export default function DashboardBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const bookingId = bookingIdFromParams(params);

  const [booking, setBooking] = useState<DashboardBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const load = useCallback(async () => {
    if (!bookingId) {
      setLoading(false);
      setError("Invalid booking reference.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardBooking(bookingId);
      setBooking(data);
    } catch (err) {
      setBooking(null);
      setError(err instanceof ApiError ? err.message : "Could not load booking.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const canModify = useMemo(() => {
    if (!booking) {
      return false;
    }
    return booking.status !== "completed" && booking.status !== "cancelled";
  }, [booking]);

  const reschedule = useRescheduleFlow({
    bookingId,
    serviceId: booking?.serviceId ?? "",
    addOnIds: booking?.addOnIds ?? [],
    mockDistanceKm: booking?.distanceKm ?? 0,
    address: booking?.address ?? "",
    active: Boolean(booking && showReschedule && canModify),
  });

  const onCancel = async () => {
    if (!booking || !canModify) {
      return;
    }
    setCancelBusy(true);
    setError(null);
    try {
      const updated = await cancelDashboardBooking(booking.id);
      setBooking(updated);
      setShowReschedule(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not cancel booking.");
    } finally {
      setCancelBusy(false);
    }
  };

  const onConfirmReschedule = async () => {
    const updated = await reschedule.confirmReschedule();
    if (updated) {
      setBooking(updated);
      setShowReschedule(false);
    }
  };

  if (loading) {
    return <p className="text-small font-medium text-muted">Loading booking details</p>;
  }

  if (error && !booking) {
    return (
      <p className="text-small font-medium text-error" role="alert">
        {error}
      </p>
    );
  }

  if (!booking) {
    return <p className="text-small font-medium text-muted">Booking not found.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {error ? (
        <p className="rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          title={`Booking ${booking.id.slice(0, 8)}`}
          subtitle={booking.serviceName ?? "Service booking"}
        />
        <StatusBadge status={booking.status} />
      </div>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 text-small font-medium text-muted">
          <p>
            <span className="text-ink">Service:</span>{" "}
            <span className="text-ink">{booking.serviceName ?? booking.serviceId}</span>
          </p>
          <p>
            <span className="text-ink">Date & Time:</span> {booking.date} {booking.time}
          </p>
          <p>
            <span className="text-ink">Address:</span> {booking.address}
          </p>
          <p>
            <span className="text-ink">Phone:</span> {booking.phone}
          </p>
          <p>
            <span className="text-ink">Notes:</span> {booking.notes || "None"}
          </p>
        </div>
        <div className="space-y-2 text-small font-medium text-muted">
          <p>
            <span className="text-ink">Base:</span> {formatNgn(booking.pricing.base)}
          </p>
          <p>
            <span className="text-ink">Urgency:</span> {formatNgn(booking.pricing.urgency)}
          </p>
          <p>
            <span className="text-ink">Distance:</span> {formatNgn(booking.pricing.distance)}
          </p>
          <p>
            <span className="text-ink">Add-ons:</span> {formatNgn(booking.pricing.addons)}
          </p>
          <p className="pt-2 font-semibold text-ink">Total: {formatNgn(booking.pricing.total)}</p>
        </div>
      </section>

      {canModify ? (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <p className="text-subtitle font-semibold text-ink">Manage booking</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              disabled={cancelBusy}
              onClick={() => void onCancel()}
            >
              {cancelBusy ? "Cancelling" : "Cancel booking"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowReschedule((prev) => !prev);
                setError(null);
              }}
            >
              {showReschedule ? "Close reschedule" : "Reschedule"}
            </Button>
          </div>

          {showReschedule ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              <div className="flex flex-col gap-6 rounded-sm border border-border bg-surface p-5">
                <p className="text-body font-semibold text-ink">Choose a new slot</p>
                <div className="max-w-xs">
                  <label className="mb-2 block text-small font-semibold text-ink" htmlFor="reschedule-date">
                    Date
                  </label>
                  <Input
                    id="reschedule-date"
                    min={new Date().toISOString().slice(0, 10)}
                    type="date"
                    value={reschedule.date}
                    onChange={(event) => {
                      void reschedule.setDate(event.target.value);
                    }}
                  />
                </div>
                {reschedule.loadingSlots ? (
                  <p className="text-small font-medium text-muted">Loading slots</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {reschedule.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={
                          reschedule.selectedTime === slot
                            ? "rounded-sm bg-ink px-3 py-2 text-small font-semibold text-surface"
                            : "rounded-sm border border-border px-3 py-2 text-small font-semibold text-ink hover:bg-hover"
                        }
                        onClick={() => void reschedule.selectTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                    {reschedule.slots.length === 0 ? (
                      <p className="text-small font-medium text-muted">No open slots for this date.</p>
                    ) : null}
                  </div>
                )}
                {reschedule.error ? (
                  <p className="text-small font-medium text-error">{reschedule.error}</p>
                ) : null}
                <Button
                  onClick={() => void onConfirmReschedule()}
                  disabled={reschedule.submitting || reschedule.pricingLoading || !reschedule.pricing}
                >
                  {reschedule.submitting ? "Saving" : "Confirm new time"}
                </Button>
              </div>
              <div className="lg:sticky lg:top-8 lg:self-start">
                <PricingPanel pricing={reschedule.pricing} loading={reschedule.pricingLoading} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
