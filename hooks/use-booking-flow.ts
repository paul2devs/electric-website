"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/errors";
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from "@/lib/bookings/booking-draft-storage";
import {
  normalizeBookingFlowInit,
  type BookingFlowInit,
} from "@/lib/bookings/flow-init";
import {
  calculatePricing,
  createBooking,
  fetchAvailability,
  fetchServices,
  lockSlot,
  unlockSlot,
} from "@/lib/bookings/api";
import { resolveInitialServiceId } from "@/lib/bookings/resolve-initial-service";
import { getProjectBySlug } from "@/lib/data/projects";
import { buildProjectBookingMessage } from "@/lib/projects/booking-bridge";
import type {
  BookingDetails,
  BookingResult,
  BookingStep,
  PricingResult,
} from "@/lib/bookings/types";
import type { EnrichedBackendService } from "@/lib/services/service-media";
import { validateEmail } from "@/lib/validation/auth-fields";
import { validatePhoneRequired } from "@/lib/validation/phone";

const emptyDetails: BookingDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  mockDistanceKm: 0,
};

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useBookingFlow(flowInit?: BookingFlowInit | string) {
  const { serviceId: initialServiceId, projectSlug, inspiredBy: initialInspiredBy } =
    normalizeBookingFlowInit(flowInit);
  const { user, isReady: authReady } = useAuth();

  const [services, setServices] = useState<EnrichedBackendService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const [step, setStep] = useState<BookingStep>(1);
  const [selectedServiceId, setSelectedServiceIdState] = useState("");
  const [selectedDate, setSelectedDateState] = useState(todayDateString());
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [pricing, setPricing] = useState<PricingResult | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  const [lockToken, setLockToken] = useState("");
  const [lockExpiresInSeconds, setLockExpiresInSeconds] = useState(0);
  const [details, setDetails] = useState<BookingDetails>(emptyDetails);
  const [inspiredBy, setInspiredBy] = useState("");
  const [activeProjectSlug, setActiveProjectSlug] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof BookingDetails, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const selectedService = useMemo(
    () => services.find((item) => item.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

  const refreshPricing = useCallback(
    async (overrides: {
      serviceId?: string;
      date?: string;
      time?: string;
      addOnIds?: string[];
      details?: Partial<BookingDetails>;
    } = {}) => {
      const serviceId = overrides.serviceId ?? selectedServiceId;
      if (!serviceId) {
        setPricing(null);
        return;
      }

      const mergedDetails: BookingDetails = {
        ...details,
        ...(overrides.details ?? {}),
      };

      const date = overrides.date ?? selectedDate;
      const time = overrides.time ?? selectedTime;
      const addOnIds = overrides.addOnIds ?? selectedAddOnIds;

      setPricingLoading(true);
      try {
        const response = await calculatePricing({
          serviceId,
          date: date || undefined,
          time: time || undefined,
          address: mergedDetails.address || undefined,
          mockDistanceKm: mergedDetails.mockDistanceKm,
          addOnIds,
        });
        setPricing(response);
      } catch {
        setPricing(null);
      } finally {
        setPricingLoading(false);
      }
    },
    [details, selectedAddOnIds, selectedDate, selectedServiceId, selectedTime],
  );

  const refreshSlots = useCallback(
    async (serviceId: string, date: string, currentTime?: string) => {
      if (!serviceId || !date) {
        setSlots([]);
        setSelectedTime("");
        return;
      }
      setAvailabilityLoading(true);
      setAvailabilityError(null);
      try {
        const data = await fetchAvailability(serviceId, date);
        setSlots(data);
        if (currentTime && !data.includes(currentTime)) {
          setSelectedTime("");
          setLockToken("");
          setLockExpiresInSeconds(0);
        }
      } catch (error) {
        setAvailabilityError(
          error instanceof ApiError ? error.message : "Could not load availability",
        );
        setSlots([]);
      } finally {
        setAvailabilityLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!authReady || draftRestored) {
      return;
    }
    const draft = loadBookingDraft();
    queueMicrotask(() => {
      if (draft) {
        setStep(draft.step > 4 ? 4 : draft.step);
        setSelectedServiceIdState(draft.selectedServiceId);
        setSelectedDateState(draft.selectedDate || todayDateString());
        setSelectedTime(draft.selectedTime);
        setSelectedAddOnIds(draft.selectedAddOnIds);
        setDetails({ ...emptyDetails, ...draft.details });
        setInspiredBy(draft.inspiredBy ?? "");
        setActiveProjectSlug(draft.projectSlug ?? "");
      }
      setDraftRestored(true);
    });
  }, [authReady, draftRestored]);

  useEffect(() => {
    if (!draftRestored || !projectSlug) {
      return;
    }
    const project = getProjectBySlug(projectSlug);
    if (!project) {
      return;
    }
    queueMicrotask(() => {
      setActiveProjectSlug(projectSlug);
      setInspiredBy((prev) => prev || initialInspiredBy || project.title);
      setDetails((prev) => ({
        ...prev,
        notes: prev.notes.trim() ? prev.notes : buildProjectBookingMessage(project),
      }));
    });
  }, [draftRestored, initialInspiredBy, projectSlug]);

  useEffect(() => {
    if (!authReady || !user) {
      return;
    }
    queueMicrotask(() => {
      setDetails((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "",
      }));
    });
  }, [authReady, user]);

  useEffect(() => {
    if (!draftRestored || step === 5) {
      return;
    }
    saveBookingDraft({
      step,
      selectedServiceId,
      selectedDate,
      selectedTime,
      selectedAddOnIds,
      details,
      inspiredBy: inspiredBy || undefined,
      projectSlug: activeProjectSlug || undefined,
    });
  }, [
    activeProjectSlug,
    details,
    draftRestored,
    inspiredBy,
    selectedAddOnIds,
    selectedDate,
    selectedServiceId,
    selectedTime,
    step,
  ]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingServices(true);
      setServiceError(null);
      try {
        const list = await fetchServices();
        if (!active) {
          return;
        }
        setServices(list);
        const draft = loadBookingDraft();
        const fromQuery = initialServiceId
          ? resolveInitialServiceId(initialServiceId, list)
          : undefined;
        const resolvedId =
          fromQuery ?? (!initialServiceId ? draft?.selectedServiceId : undefined) ?? "";

        if (initialServiceId && !fromQuery) {
          setFlowError(
            `Could not match service "${initialServiceId}". Choose your service from the list below.`,
          );
        }

        if (resolvedId) {
          const day = draft?.selectedDate || todayDateString();
          setSelectedServiceIdState(resolvedId);
          setSelectedDateState(day);
          if (draft?.selectedTime) {
            setSelectedTime(draft.selectedTime);
          }
          if (draft?.selectedAddOnIds?.length) {
            setSelectedAddOnIds(draft.selectedAddOnIds);
          }
          await refreshSlots(resolvedId, day, draft?.selectedTime);
          await refreshPricing({ serviceId: resolvedId, date: day, time: draft?.selectedTime });
        }
      } catch (error) {
        if (!active) {
          return;
        }
        setServiceError(
          error instanceof ApiError ? error.message : "Could not load services",
        );
      } finally {
        if (active) {
          setLoadingServices(false);
        }
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount + initial query only
  }, [initialServiceId]);

  const setSelectedServiceId = useCallback(
    async (serviceId: string) => {
      if (lockToken && selectedServiceId && selectedDate && selectedTime) {
        try {
          await unlockSlot({
            serviceId: selectedServiceId,
            date: selectedDate,
            time: selectedTime,
            lockToken,
          });
        } catch {
          /* no-op */
        }
      }

      setSelectedServiceIdState(serviceId);
      setSlots([]);
      setSelectedTime("");
      setSelectedAddOnIds([]);
      setLockToken("");
      setLockExpiresInSeconds(0);
      setAvailabilityError(null);
      const defaultDate = todayDateString();
      setSelectedDateState(defaultDate);
      await refreshSlots(serviceId, defaultDate);
      await refreshPricing({
        serviceId,
        date: defaultDate,
        time: "",
        addOnIds: [],
      });
    },
    [lockToken, refreshPricing, refreshSlots, selectedDate, selectedServiceId, selectedTime],
  );

  const setSelectedDate = useCallback(
    async (date: string) => {
      if (lockToken && selectedServiceId && selectedDate && selectedTime) {
        try {
          await unlockSlot({
            serviceId: selectedServiceId,
            date: selectedDate,
            time: selectedTime,
            lockToken,
          });
        } catch {
          /* no-op */
        }
      }

      setSelectedDateState(date);
      setSelectedTime("");
      setLockToken("");
      setLockExpiresInSeconds(0);
      await refreshSlots(selectedServiceId, date);
      await refreshPricing({ date, time: "" });
    },
    [lockToken, refreshPricing, refreshSlots, selectedDate, selectedServiceId, selectedTime],
  );

  const selectTime = useCallback(
    async (time: string) => {
      if (!selectedServiceId || !selectedDate) {
        return;
      }

      if (lockToken && selectedTime) {
        try {
          await unlockSlot({
            serviceId: selectedServiceId,
            date: selectedDate,
            time: selectedTime,
            lockToken,
          });
        } catch {
          /* no-op */
        }
      }

      setFlowError(null);
      try {
        const lock = await lockSlot({
          serviceId: selectedServiceId,
          date: selectedDate,
          time,
        });
        setSelectedTime(time);
        setLockToken(lock.lockToken);
        setLockExpiresInSeconds(lock.expiresInSeconds);
        await refreshPricing({ time });
      } catch (error) {
        setFlowError(error instanceof ApiError ? error.message : "Could not lock slot");
        await refreshSlots(selectedServiceId, selectedDate, selectedTime);
      }
    },
    [lockToken, refreshPricing, refreshSlots, selectedDate, selectedServiceId, selectedTime],
  );

  const toggleAddOn = useCallback(
    async (addOnId: string) => {
      const next = selectedAddOnIds.includes(addOnId)
        ? selectedAddOnIds.filter((id) => id !== addOnId)
        : [...selectedAddOnIds, addOnId];
      setSelectedAddOnIds(next);
      await refreshPricing({ addOnIds: next });
    },
    [refreshPricing, selectedAddOnIds],
  );

  const setDetail = useCallback(
    async <K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) => {
      const patch = { [key]: value } as Partial<BookingDetails>;
      setDetails((prev) => ({ ...prev, ...patch }));
      setFieldErrors((prev) => {
        if (!prev[key]) {
          return prev;
        }
        const next = { ...prev };
        delete next[key];
        return next;
      });
      if (key === "address" || key === "mockDistanceKm") {
        await refreshPricing({ details: patch });
      }
    },
    [refreshPricing],
  );

  const validateDetails = useCallback((): boolean => {
    const errors: Partial<Record<keyof BookingDetails, string>> = {};
    if (!details.fullName.trim() || details.fullName.trim().length < 2) {
      errors.fullName = "Enter your full name.";
    }
    const emailErr = validateEmail(details.email);
    if (emailErr) {
      errors.email = emailErr;
    }
    const phoneErr = validatePhoneRequired(details.phone);
    if (phoneErr) {
      errors.phone = phoneErr;
    }
    if (!details.address.trim() || details.address.trim().length < 5) {
      errors.address = "Enter a valid service address.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [details]);

  const canProceed = useMemo(() => {
    if (step === 1) {
      return Boolean(selectedServiceId);
    }
    if (step === 2) {
      return Boolean(selectedDate && selectedTime && lockToken);
    }
    if (step === 3) {
      return (
        details.fullName.trim().length >= 2 &&
        !validateEmail(details.email) &&
        !validatePhoneRequired(details.phone) &&
        details.address.trim().length >= 5
      );
    }
    if (step === 4) {
      return Boolean(pricing && !pricingLoading);
    }
    return false;
  }, [
    details.address,
    details.email,
    details.fullName,
    details.phone,
    lockToken,
    pricing,
    pricingLoading,
    selectedDate,
    selectedServiceId,
    selectedTime,
    step,
  ]);

  const next = useCallback(() => {
    setFlowError(null);
    if (step === 1 && !selectedServiceId) {
      setFlowError("Select a service to continue.");
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime || !lockToken)) {
      setFlowError("Choose a date and available time slot.");
      return;
    }
    if (step === 3 && !validateDetails()) {
      setFlowError("Complete the required fields below.");
      return;
    }
    if (step < 4) {
      setStep((prev) => (prev + 1) as BookingStep);
    }
  }, [
    lockToken,
    selectedDate,
    selectedServiceId,
    selectedTime,
    step,
    validateDetails,
  ]);

  const back = useCallback(async () => {
    if ((step === 2 || step === 3) && lockToken && selectedServiceId && selectedDate && selectedTime) {
      try {
        await unlockSlot({
          serviceId: selectedServiceId,
          date: selectedDate,
          time: selectedTime,
          lockToken,
        });
      } catch {
        /* no-op */
      }
      setLockToken("");
      setLockExpiresInSeconds(0);
      setSelectedTime("");
    }
    if (step > 1 && step < 5) {
      setStep((prev) => (prev - 1) as BookingStep);
    }
  }, [lockToken, selectedDate, selectedServiceId, selectedTime, step]);

  const confirm = useCallback(async () => {
    if (!selectedServiceId || !selectedDate || !selectedTime || !lockToken) {
      setFlowError("Your slot lock expired. Pick date and time again.");
      setStep(2);
      return;
    }
    if (!pricing) {
      setFlowError("Pricing is unavailable. Go back and try again.");
      return;
    }
    if (!validateDetails()) {
      setFlowError("Check your contact details.");
      setStep(3);
      return;
    }

    setSubmitting(true);
    setFlowError(null);
    try {
      const booking = await createBooking({
        serviceId: selectedServiceId,
        date: selectedDate,
        time: selectedTime,
        lockToken,
        phone: details.phone.trim(),
        address: details.address.trim(),
        notes: details.notes.trim() || undefined,
        addOnIds: selectedAddOnIds,
        mockDistanceKm: details.mockDistanceKm,
        quotedTotal: pricing.breakdown.total,
      });
      setResult(booking);
      setStep(5);
      setLockToken("");
      setLockExpiresInSeconds(0);
      clearBookingDraft();
    } catch (error) {
      setFlowError(error instanceof ApiError ? error.message : "Booking failed");
      if (error instanceof ApiError && error.status === 400) {
        setStep(2);
        await refreshSlots(selectedServiceId, selectedDate, selectedTime);
        await refreshPricing();
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    details,
    lockToken,
    pricing,
    refreshPricing,
    refreshSlots,
    selectedAddOnIds,
    selectedDate,
    selectedServiceId,
    selectedTime,
    validateDetails,
  ]);

  useEffect(() => {
    return () => {
      if (lockToken && selectedServiceId && selectedDate && selectedTime) {
        void unlockSlot({
          serviceId: selectedServiceId,
          date: selectedDate,
          time: selectedTime,
          lockToken,
        });
      }
    };
  }, [lockToken, selectedDate, selectedServiceId, selectedTime]);

  return {
    step,
    services,
    selectedService,
    selectedServiceId,
    selectedDate,
    slots,
    selectedTime,
    selectedAddOnIds,
    details,
    fieldErrors,
    pricing,
    pricingLoading,
    loadingServices,
    availabilityLoading,
    availabilityError,
    serviceError,
    flowError,
    submitting,
    lockExpiresInSeconds,
    inspiredBy,
    result,
    canProceed,
    setSelectedServiceId,
    setSelectedDate,
    selectTime,
    toggleAddOn,
    setDetail,
    next,
    back,
    confirm,
  };
}
