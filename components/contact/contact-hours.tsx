import { Container } from "@/components/layout/container";
import { getServiceHoursLine } from "@/lib/constants/site-contact";

export function ContactHours() {
  return (
    <section className="border-b border-border section-gradient-surface">
      <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="max-w-xl">
          <h2 className="text-subtitle font-semibold tracking-tight text-ink">Service hours</h2>
          <dl className="mt-6 space-y-4 text-body">
            <div className="border-t border-border pt-4">
              <dt className="text-small font-semibold uppercase tracking-[0.1em] text-muted">
                Standard hours
              </dt>
              <dd className="mt-2 font-medium text-ink">{getServiceHoursLine()}</dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="text-small font-semibold uppercase tracking-[0.1em] text-muted">
                Emergency
              </dt>
              <dd className="mt-2 font-medium text-ink">
                Emergency electrical support available 24/7 for urgent safety issues.
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
