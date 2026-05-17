export function ServiceHeroUiMock() {
  return (
    <div
      className="w-full max-w-[20rem] border border-border bg-surface p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      aria-hidden
    >
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-3">
        <span className="text-small font-semibold tracking-tight text-ink">Services</span>
        <span className="h-2 w-12 bg-ink/10" />
      </div>
      <div className="mb-2 flex gap-2">
        <span className="h-2 w-10 rounded-[1px] bg-ink" />
        <span className="h-2 w-14 rounded-[1px] bg-ink/15" />
        <span className="h-2 w-12 rounded-[1px] bg-ink/15" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-border/80 py-2">
          <div className="space-y-1">
            <div className="h-2 w-32 max-w-full bg-ink/80" />
            <div className="h-1.5 w-40 max-w-full bg-ink/12" />
          </div>
          <span className="text-small text-muted">→</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <div className="h-2 w-28 max-w-full bg-ink/35" />
            <div className="h-1.5 w-36 max-w-full bg-ink/10" />
          </div>
          <span className="text-small text-muted">→</span>
        </div>
      </div>
    </div>
  );
}
