"use client";

import { cn } from "@/lib/utils";
import type { BookingStep } from "@/lib/bookings/types";

const STEPS = [
  { id: 1 as const, label: "Service" },
  { id: 2 as const, label: "Schedule" },
  { id: 3 as const, label: "Details" },
  { id: 4 as const, label: "Confirm" },
];

type BookingProgressProps = {
  step: BookingStep;
};

export function BookingProgress({ step }: BookingProgressProps) {
  const activeStep = step > 4 ? 4 : step;

  return (
    <nav aria-label="Booking progress" className="border-b border-border pb-6">
      <ol className="flex list-none flex-wrap items-center gap-x-2 gap-y-3 p-0 sm:gap-x-4">
        {STEPS.map((item, index) => {
          const isActive = activeStep === item.id;
          const isComplete = activeStep > item.id;
          return (
            <li key={item.id} className="flex items-center gap-2 sm:gap-4">
              {index > 0 ? (
                <span
                  className={cn(
                    "hidden h-px w-6 sm:block sm:w-10",
                    isComplete ? "bg-ink" : "bg-border",
                  )}
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "text-small font-medium transition-colors duration-200",
                  isActive ? "text-ink" : isComplete ? "text-ink/70" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "mr-2 inline-block border-b-2 pb-0.5 transition-colors",
                    isActive ? "border-ink" : "border-transparent",
                  )}
                >
                  {item.label}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
