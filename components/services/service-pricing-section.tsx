import { Container } from "@/components/layout/container";
import { formatNgn } from "@/lib/utils/format-currency";

const FACTORS = [
  "Service type",
  "Project size",
  "Installation complexity",
  "Urgency level",
  "Materials required",
] as const;

const EXAMPLES: readonly { label: string; low: number; high: number }[] = [
  { label: "Wiring installation", low: 420_000, high: 920_000 },
  { label: "CCTV setup", low: 250_000, high: 620_000 },
  { label: "Repairs", low: 45_000, high: 180_000 },
] as const;

export function ServicePricingSection() {
  return (
    <section className="border-b border-border section-gradient-muted">
      <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-small font-medium uppercase tracking-[0.14em] text-muted">Pricing</p>
          <h2 className="mt-3 text-title font-semibold tracking-tight text-ink">
            Transparent pricing, based on your needs.
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted">
            Every service is priced based on scope, complexity, and urgency — ensuring fair and
            accurate cost estimation.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ul className="space-y-4 border-t border-border pt-6">
            {FACTORS.map((factor) => (
              <li
                key={factor}
                className="flex items-baseline justify-between gap-4 border-b border-border/80 py-3 text-body text-ink"
              >
                <span>{factor}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-6">
            <p className="text-body leading-relaxed text-muted">
              Pricing is calculated based on the specific requirements of your service, ensuring
              accurate estimates and no unnecessary charges. Estimates are{" "}
              <span className="text-ink font-medium">transparent</span>,{" "}
              <span className="text-ink font-medium">structured</span>, and{" "}
              <span className="text-ink font-medium">fair</span>.
            </p>
            <div className="mt-10 border border-border bg-surface px-5 py-5">
              <p className="text-small font-semibold text-ink">Get an estimate before booking.</p>
              <p className="mt-2 text-body leading-relaxed text-muted">
                You&apos;ll receive a clear cost range before confirming your service.
              </p>
            </div>
            <div className="mt-10 space-y-3">
              <p className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
                Typical service ranges
              </p>
              <ul className="space-y-2 text-body text-ink">
                {EXAMPLES.map((row) => (
                  <li key={row.label} className="flex flex-wrap gap-x-2 gap-y-1">
                    <span className="font-medium">{row.label}</span>
                    <span className="text-muted">→</span>
                    <span>
                      {formatNgn(row.low)} – {formatNgn(row.high)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
