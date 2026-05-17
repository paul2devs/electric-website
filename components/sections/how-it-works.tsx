import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const steps = [
  {
    num: "01",
    title: "Choose a Service",
    body: "Pick from installations, maintenance, solar, smart systems, or rapid repairs — aligned with what you see on the services page.",
  },
  {
    num: "02",
    title: "Pick a Date & Time",
    body: "Lock a slot that fits your site rules; availability and pricing stay visible before you commit.",
  },
  {
    num: "03",
    title: "Get It Done",
    body: "Technicians arrive with a clear scope, execute to standard, and hand over documentation you can file.",
  },
] as const;

export function HowItWorks() {
  return (
    <Section id="how-it-works" spacing="default" className="bg-white scroll-mt-[4.5rem]">
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-small font-semibold uppercase tracking-[0.2em] text-muted">
            Testimonydot
          </p>
          <Heading level={2} className="mt-3">
            How it works
          </Heading>
          <p className="mt-4 text-body leading-relaxed text-muted">
            A calm, linear path from selection to completion — built for operational teams, not marketing theatre.
          </p>
        </header>

        <div className="relative mt-14 lg:mt-16">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[2.25rem] hidden h-px bg-border lg:block"
            aria-hidden
          />
          <ol className="relative grid list-none gap-10 p-0 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <li key={step.num} className="group flex flex-col lg:pt-0">
                <span
                  className="text-5xl font-semibold tabular-nums tracking-tight text-zinc-300 transition-colors duration-150 group-hover:text-zinc-400 sm:text-6xl"
                  aria-hidden
                >
                  {step.num}
                </span>
                <p className="mt-4 text-subtitle font-semibold text-ink transition-colors duration-150 group-hover:text-accent">
                  {step.title}
                </p>
                <p className="mt-2 text-small leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
