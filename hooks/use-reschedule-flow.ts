"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/errors";
import {
  calculatePricing,
  fetchAvailability,
  lockSlot,
  unlockSlot,
} from "@/lib/bookings/api";
import type { PricingResult } from "@/lib/bookings/types";
import { rescheduleDashboardBooking } from "@/lib/dashboard/api";
import type { DashboardBooking } from "@/lib/dashboard/types";

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useRescheduleFlow(opts: {
  bookingId: string;
  serviceId: string;
  addOnIds: string[];
  mockDistanceKm: number;
  address: string;
  active: boolean;
}) {
  const [date, setDateState] = useState(todayDateString);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [lockToken, setLockToken] = useState("");
  const [pricing, setPricing] = useState<PricingResult | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!opts.active || !opts.serviceId) {
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingSlots(true);
      setError(null);
      try {
        const data = await fetchAvailability(opts.serviceId, date);
        if (!cancelled) {
          setSlots(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load availability");
          setSlots([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [opts.active, opts.serviceId, date]);

  useEffect(() => {
    if (!opts.active || !opts.serviceId) {
      return;
    }
    let cancelled = false;
    (async () => {
      setPricingLoading(true);
      try {
        const response = await calculatePricing({
          serviceId: opts.serviceId,
          date: date || undefined,
          time: selectedTime || undefined,
          address: opts.address || undefined,
          mockDistanceKm: opts.mockDistanceKm,
          addOnIds: opts.addOnIds,
        });
        if (!cancelled) {
          setPricing(response);
        }
      } catch {
        if (!cancelled) {
          setPricing(null);
        }
      } finally {
        if (!cancelled) {
          setPricingLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    opts.active,
    opts.serviceId,
    opts.addOnIds,
    opts.address,
    opts.mockDistanceKm,
    date,
    selectedTime,
  ]);

  const setDate = useCallback(
    async (next: string) => {
      if (lockToken && opts.serviceId && date && selectedTime) {
        try {
          await unlockSlot({
            serviceId: opts.serviceId,
            date,
            time: selectedTime,
            lockToken,
          });
        } catch {
          /* no-op */
        }
      }
      setLockToken("");
      setSelectedTime("");
      setDateState(next);
    },
    [date, lockToken, opts.serviceId, selectedTime],
  );

  const selectTime = useCallback(
    async (time: string) => {
      if (!opts.serviceId || !date) {
        return;
      }
      if (lockToken && selectedTime) {
        try {
          await unlockSlot({
            serviceId: opts.serviceId,
            date,
            time: selectedTime,
            lockToken,
          });
        } catch {
          /* no-op */
        }
      }
      setError(null);
      try {
        const lock = await lockSlot({
          serviceId: opts.serviceId,
          date,
          time,
        });
        setSelectedTime(time);
        setLockToken(lock.lockToken);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not lock slot");
      }
    },
    [date, lockToken, opts.serviceId, selectedTime],
  );

  const confirmReschedule = useCallback(async (): Promise<DashboardBooking | null> => {
    if (!opts.serviceId || !date || !selectedTime || !lockToken || !pricing) {
      setError("Select a valid slot and wait for pricing.");
      return null;
    }
    setSubmitting(true);
    setError(null);
    try {
      const updated = await rescheduleDashboardBooking(opts.bookingId, {
        date,
        time: selectedTime,
        lockToken,
        quotedTotal: pricing.breakdown.total,
      });
      setLockToken("");
      setSelectedTime("");
      return updated;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reschedule failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [date, lockToken, opts.bookingId, opts.serviceId, pricing, selectedTime]);

  useEffect(() => {
    return () => {
      if (lockToken && opts.serviceId && date && selectedTime) {
        void unlockSlot({
          serviceId: opts.serviceId,
          date,
          time: selectedTime,
          lockToken,
        });
      }
    };
  }, [date, lockToken, opts.serviceId, selectedTime]);

  return {
    date,
    setDate,
    slots,
    selectedTime,
    selectTime,
    pricing,
    pricingLoading,
    loadingSlots,
    error,
    submitting,
    confirmReschedule,
  };
}
