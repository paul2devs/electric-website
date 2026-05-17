export function FeatureHighlightVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-zinc-50 text-left shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-zinc-300" />
          <span className="h-2 w-2 rounded-full bg-zinc-300" />
          <span className="h-2 w-2 rounded-full bg-zinc-300" />
        </span>
        <span className="text-small font-medium text-muted">Bookings</span>
        <span className="ml-auto text-small tabular-nums text-muted">Today</span>
      </div>
      <div className="flex min-h-[14rem] flex-col sm:min-h-[16rem] lg:flex-row">
        <div className="hidden w-36 shrink-0 border-b border-border bg-surface px-3 py-4 lg:block lg:border-b-0 lg:border-r">
          <div className="space-y-3 text-small text-muted">
            <p className="font-medium text-ink">Overview</p>
            <p>Schedule</p>
            <p>Pricing</p>
            <p>History</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-small font-semibold text-ink">Select time</p>
            <p className="text-small text-muted">Slot locked · 4:00 left</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {["09:00", "10:00", "11:00", "14:00"].map((t) => (
              <div
                key={t}
                className={
                  t === "10:00"
                    ? "rounded-sm border border-accent bg-accent-muted px-2 py-2 text-center text-small font-medium text-ink"
                    : "rounded-sm border border-border bg-surface px-2 py-2 text-center text-small text-muted"
                }
              >
                {t}
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-small text-muted">Estimated total</p>
              <p className="text-subtitle font-semibold tabular-nums text-ink">₦ 284,500</p>
            </div>
            <p className="mt-1 text-small text-muted">Includes base service · distance · urgency</p>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
            <p className="text-small text-muted">Step 2 of 4</p>
            <div className="h-1.5 flex-1 max-w-[8rem] rounded-full bg-border">
              <div className="h-full w-1/2 rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
