"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type BookingCalendarProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const today = useMemo(() => toYmd(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

  const cells = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const startOffset = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const cell = new Date(gridStart);
      cell.setDate(gridStart.getDate() + index);
      const ymd = toYmd(cell);
      return {
        ymd,
        day: cell.getDate(),
        inMonth: cell.getMonth() === viewMonth.getMonth(),
        isPast: ymd < today,
        isToday: ymd === today,
        isSelected: ymd === selectedDate,
      };
    });
  }, [selectedDate, today, viewMonth]);

  const monthLabel = viewMonth.toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-sm px-2 py-1 text-small font-medium text-muted hover:bg-hover hover:text-ink"
          aria-label="Previous month"
          onClick={() => setViewMonth((prev) => addMonths(prev, -1))}
        >
          ←
        </button>
        <p className="text-small font-semibold text-ink">{monthLabel}</p>
        <button
          type="button"
          className="rounded-sm px-2 py-1 text-small font-medium text-muted hover:bg-hover hover:text-ink"
          aria-label="Next month"
          onClick={() => setViewMonth((prev) => addMonths(prev, 1))}
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell) => (
          <button
            key={cell.ymd}
            type="button"
            disabled={cell.isPast || !cell.inMonth}
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-sm text-small font-medium transition-colors",
              !cell.inMonth && "invisible",
              cell.isPast && cell.inMonth && "cursor-not-allowed text-muted/40",
              !cell.isPast &&
                cell.inMonth &&
                (cell.isSelected
                  ? "bg-ink text-surface"
                  : "text-ink hover:bg-hover"),
              cell.isToday && !cell.isSelected && "ring-1 ring-ink/20",
            )}
            onClick={() => onSelectDate(cell.ymd)}
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  );
}
