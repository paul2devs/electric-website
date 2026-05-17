"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { BookingDetailsStep } from "@/components/booking/booking-details-step";
import { BookingProgress } from "@/components/booking/booking-progress";
import { BookingScheduleStep } from "@/components/booking/booking-schedule-step";
import { BookingServicePicker } from "@/components/booking/booking-service-picker";
import { BookingSummaryPanel } from "@/components/booking/booking-summary-panel";
import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import { routes } from "@/lib/constants/routes";
import { formatNgn } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function BookingFlow() {
  const searchParams = useSearchParams();
  const booking = useBookingFlow({
    serviceId: searchParams.get("serviceId") ?? undefined,
    projectSlug: searchParams.get("project") ?? undefined,
    inspiredBy: searchParams.get("inspired") ?? undefined,
  });

  const showError =
    booking.serviceError || booking.availabilityError || booking.flowError;

  const stepTitle =
    booking.step === 1
      ? "Select your service"
      : booking.step === 2
        ? "Choose date & time"
        : booking.step === 3
          ? "Your details"
          : booking.step === 4
            ? "Review & confirm"
            : "Booking confirmed";

  const primaryLabel =
    booking.step === 4
      ? booking.submitting
        ? "Confirming…"
        : "Confirm booking"
      : "Continue";

  const onPrimary = () => {
    if (booking.step === 4) {
      void booking.confirm();
    } else {
      booking.next();
    }
  };

  if (booking.step === 5 && booking.result) {
    return (
      <div className="mx-auto max-w-xl py-8">
        <h2 className="text-title font-semibold tracking-tight text-ink">Booking confirmed</h2>
        <p className="mt-4 text-body text-muted">
          Reference <span className="font-medium text-ink">{booking.result.id.slice(0, 8)}</span>{" "}
          · {booking.result.status}
        </p>
        <p className="mt-2 text-body text-muted">
          Total: <span className="font-medium text-ink">{formatNgn(booking.result.pricing.total)}</span>
        </p>
        <p className="mt-4 text-body text-muted">
          You will receive a confirmation via email.
        </p>
        <Link
          href={routes.dashboardBookings}
          className="mt-8 inline-block text-small font-medium text-accent underline"
        >
          View your bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-28 lg:pb-0">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,22rem)] lg:gap-14 lg:items-start">
        <div
          className={cn(
            "min-w-0 transition-opacity duration-300",
            booking.submitting && "pointer-events-none opacity-60",
          )}
        >
          <BookingProgress step={booking.step} />

          {showError ? (
            <p
              className="mt-6 rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error"
              role="alert"
            >
              {showError}
            </p>
          ) : null}

          <div className="mt-8" key={booking.step}>
            <h2 className="text-subtitle font-semibold tracking-tight text-ink">{stepTitle}</h2>

            <div className="mt-8">
              {booking.step === 1 ? (
                <>
                  <BookingServicePicker
                    services={booking.services}
                    selectedServiceId={booking.selectedServiceId}
                    loading={booking.loadingServices}
                    onSelect={(id) => {
                      void booking.setSelectedServiceId(id);
                    }}
                  />
                  {booking.selectedService && booking.selectedService.addOns.length > 0 ? (
                    <div className="mt-10 border-t border-border pt-8">
                      <h3 className="text-small font-semibold uppercase tracking-[0.1em] text-muted">
                        Optional add-ons
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {booking.selectedService.addOns.map((addOn) => {
                          const checked = booking.selectedAddOnIds.includes(addOn.id);
                          return (
                            <li key={addOn.id}>
                              <label className="flex cursor-pointer items-center justify-between gap-4 py-1">
                                <span className="flex items-center gap-3 text-body text-ink">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded-sm border-border"
                                    checked={checked}
                                    onChange={() => {
                                      void booking.toggleAddOn(addOn.id);
                                    }}
                                  />
                                  {addOn.name}
                                </span>
                                <span className="text-small text-muted">
                                  +{formatNgn(addOn.price)}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : null}

              {booking.step === 2 ? (
                <BookingScheduleStep
                  selectedDate={booking.selectedDate}
                  selectedTime={booking.selectedTime}
                  slots={booking.slots}
                  loading={booking.availabilityLoading}
                  lockExpiresInSeconds={booking.lockExpiresInSeconds}
                  onSelectDate={booking.setSelectedDate}
                  onSelectTime={booking.selectTime}
                />
              ) : null}

              {booking.step === 3 ? (
                <BookingDetailsStep
                  details={booking.details}
                  fieldErrors={booking.fieldErrors}
                  onChange={booking.setDetail}
                />
              ) : null}

              {booking.step === 4 ? (
                <dl className="max-w-md space-y-5 text-body">
                  <div className="border-b border-border pb-4">
                    <dt className="text-small text-muted">Service</dt>
                    <dd className="mt-1 font-medium text-ink">{booking.selectedService?.name}</dd>
                  </div>
                  {booking.inspiredBy ? (
                    <div className="border-b border-border pb-4">
                      <dt className="text-small text-muted">Inspired by</dt>
                      <dd className="mt-1 font-medium text-ink">{booking.inspiredBy}</dd>
                    </div>
                  ) : null}
                  <div className="border-b border-border pb-4">
                    <dt className="text-small text-muted">Schedule</dt>
                    <dd className="mt-1 font-medium text-ink">
                      {booking.selectedDate} at {booking.selectedTime}
                    </dd>
                  </div>
                  <div className="border-b border-border pb-4">
                    <dt className="text-small text-muted">Contact</dt>
                    <dd className="mt-1 font-medium text-ink">{booking.details.fullName}</dd>
                    <dd className="text-muted">{booking.details.phone}</dd>
                    <dd className="text-muted">{booking.details.email}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-muted">Location</dt>
                    <dd className="mt-1 font-medium text-ink">{booking.details.address}</dd>
                  </div>
                  {booking.pricing ? (
                    <div className="pt-2">
                      <dt className="text-small text-muted">Estimated total</dt>
                      <dd className="mt-1 text-title font-semibold text-ink">
                        {formatNgn(booking.pricing.breakdown.total)}
                      </dd>
                    </div>
                  ) : null}
                  <p className="pt-2 text-small text-muted">
                    You will receive a confirmation via email.
                  </p>
                </dl>
              ) : null}
            </div>

            <div className="mt-10 hidden flex-wrap gap-3 lg:flex">
              {booking.step > 1 ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    void booking.back();
                  }}
                >
                  Back
                </Button>
              ) : null}
              <Button onClick={onPrimary} disabled={!booking.canProceed || booking.submitting}>
                {primaryLabel}
              </Button>
            </div>
          </div>
        </div>

        <BookingSummaryPanel
          className="order-first lg:order-none"
          service={booking.selectedService}
          date={booking.selectedDate}
          time={booking.selectedTime}
          pricing={booking.pricing}
          pricingLoading={booking.pricingLoading}
          inspiredBy={booking.inspiredBy || undefined}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-4 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-content gap-3">
          {booking.step > 1 ? (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                void booking.back();
              }}
            >
              Back
            </Button>
          ) : null}
          <Button
            className="flex-[2]"
            onClick={onPrimary}
            disabled={!booking.canProceed || booking.submitting}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
