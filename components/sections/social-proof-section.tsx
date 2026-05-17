import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { socialProofContent } from "@/lib/content/home-marketing";

export function SocialProofSection() {
  return (
    <Section spacing="default" className="border-b border-border bg-zinc-50">
      <Container>
        <header className="max-w-2xl">
          <p className="text-small font-semibold uppercase tracking-[0.2em] text-muted">
            {socialProofContent.headerLabel}
          </p>
          <Heading level={2} className="mt-3">
            {socialProofContent.headerHeading}
          </Heading>
        </header>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-y-12">
          {socialProofContent.metrics.map((m) => (
            <div
              key={m.label}
              className="group flex flex-col gap-1 border-l border-border pl-4 transition-colors duration-150"
            >
              <p className="text-3xl font-semibold tracking-tight text-ink transition-colors duration-150 group-hover:text-accent sm:text-4xl">
                {m.value}
              </p>
              <p className="text-small font-medium uppercase tracking-[0.12em] text-muted">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-14 max-w-3xl border-t border-border pt-10 text-body leading-relaxed text-muted">
          {socialProofContent.context}
        </p>

        <figure className="mt-10 max-w-3xl border-t border-border pt-10">
          <blockquote className="text-title font-medium leading-snug text-ink">
            &ldquo;{socialProofContent.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-small text-muted">
            — {socialProofContent.quoteAttribution}
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
