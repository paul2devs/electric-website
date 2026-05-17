"use client";

import { FloatingField } from "@/components/ui/floating-field";
import type { BookingDetails } from "@/lib/bookings/types";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border-0 bg-transparent px-3 pb-2.5 pt-1 text-body text-ink placeholder:text-muted focus:outline-none";

type BookingDetailsStepProps = {
  details: BookingDetails;
  fieldErrors: Partial<Record<keyof BookingDetails, string>>;
  onChange: <K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) => void;
};

export function BookingDetailsStep({ details, fieldErrors, onChange }: BookingDetailsStepProps) {
  return (
    <div className="grid max-w-lg gap-5">
      <FloatingField id="booking-name" label="Full name" error={fieldErrors.fullName}>
        <input
          id="booking-name"
          className={fieldClass}
          autoComplete="name"
          value={details.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
      </FloatingField>
      <FloatingField id="booking-phone" label="Phone number" error={fieldErrors.phone}>
        <input
          id="booking-phone"
          className={fieldClass}
          autoComplete="tel"
          inputMode="tel"
          value={details.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </FloatingField>
      <FloatingField id="booking-email" label="Email" error={fieldErrors.email}>
        <input
          id="booking-email"
          className={fieldClass}
          type="email"
          autoComplete="email"
          value={details.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </FloatingField>
      <FloatingField id="booking-address" label="Address / location" error={fieldErrors.address}>
        <input
          id="booking-address"
          className={fieldClass}
          autoComplete="street-address"
          value={details.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </FloatingField>
      <FloatingField id="booking-notes" label="Notes (optional)" hint="Access codes, scope, or timing constraints.">
        <textarea
          id="booking-notes"
          className={cn(fieldClass, "min-h-[5rem] resize-y")}
          value={details.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FloatingField>
    </div>
  );
}
