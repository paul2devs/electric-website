"use client";

import { BookingCalendar } from "@/components/booking/booking-calendar";
import { cn } from "@/lib/utils";

type BookingScheduleStepProps = {
  selectedDate: string;
  selectedTime: string;
  slots: string[];
  loading: boolean;
  lockExpiresInSeconds: number;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
};

export function BookingScheduleStep({
  selectedDate,
  selectedTime,
  slots,
  loading,
  lockExpiresInSeconds,
  onSelectDate,
  onSelectTime,
}: BookingScheduleStepProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,16rem)_1fr] lg:items-start">
      <div>
        <h3 className="mb-3 text-small font-semibold uppercase tracking-[0.1em] text-muted">
          Calendar
        </h3>
        <BookingCalendar
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            void onSelectDate(date);
          }}
        />
      </div>
      <div>
        <h3 className="mb-3 text-small font-semibold uppercase tracking-[0.1em] text-muted">
          Available times
        </h3>
        {loading ? (
          <p className="text-small text-muted">Checking availability…</p>
        ) : slots.length === 0 ? (
          <p className="rounded-sm border border-border bg-hover/40 px-4 py-3 text-body text-muted">
            No availability — try another date.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={cn(
                  "min-h-[2.75rem] min-w-[4.5rem] rounded-sm border px-4 py-2 text-small font-medium transition-colors duration-150",
                  selectedTime === slot
                    ? "border-ink bg-ink text-surface"
                    : "border-border text-ink hover:border-ink/30 hover:bg-hover",
                )}
                onClick={() => {
                  void onSelectTime(slot);
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
        {lockExpiresInSeconds > 0 && selectedTime ? (
          <p className="mt-4 text-small text-muted">
            Slot reserved for {Math.max(1, Math.ceil(lockExpiresInSeconds / 60))} minutes.
          </p>
        ) : null}
      </div>
    </div>
  );
}
