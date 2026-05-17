import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const values = [
  {
    title: "Fast & structured response",
    body: "Triage, scheduling, and crew mobilisation follow a fixed playbook so you are never left guessing what happens next.",
  },
  {
    title: "Certified & experienced technicians",
    body: "Field teams work to documented methods, with testing and handover aligned to how Nigerian sites actually operate.",
  },
  {
    title: "Transparent pricing system",
    body: "Scope, fees, and options are stated before work starts — no surprise line items after the fact.",
  },
  {
    title: "Reliable execution",
    body: "Installations and repairs are closed out with checks, records, and clear next steps for your facilities team.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <Section spacing="default" className="bg-zinc-100">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative max-w-xl lg:pr-8">
            <div
              className="absolute -left-4 top-0 hidden h-full w-px bg-accent/35 lg:block"
              aria-hidden
            />
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-muted">
              Why Testimonydot
            </p>
            <Heading level={2} className="mt-4">
              Built for reliability, designed for real-world electrical work.
            </Heading>
            <p className="mt-5 text-body leading-relaxed text-muted">
              Every service is structured, scheduled, and executed with precision — ensuring
              consistency, safety, and long-term reliability.
            </p>
          </div>

          <ul className="flex list-none flex-col divide-y divide-border border-y border-border">
            {values.map((item) => (
              <li key={item.title}>
                <div className="group py-7 transition-colors duration-150 hover:bg-white/60 sm:px-1">
                  <p className="text-subtitle font-semibold text-ink transition-colors duration-150 group-hover:text-accent">
                    <span className="inline-block border-b border-transparent pb-0.5 transition-[border-color] duration-150 group-hover:border-accent">
                      {item.title}
                    </span>
                  </p>
                  <p className="mt-2 text-small leading-relaxed text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
