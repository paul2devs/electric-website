import { Container } from "@/components/layout/container";
import { FeatureHighlightVisual } from "@/components/sections/feature-highlight-visual";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { featureHighlightContent } from "@/lib/content/home-marketing";

export function FeatureHighlightSection() {
  return (
    <Section spacing="default" className="border-b border-border bg-white">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-muted">
              {featureHighlightContent.label}
            </p>
            <Heading level={2} className="mt-4">
              {featureHighlightContent.heading}
            </Heading>
            <p className="mt-5 text-body leading-relaxed text-muted">
              {featureHighlightContent.subtext}
            </p>
            <ul className="mt-10 flex list-none flex-col gap-8 border-t border-border pt-10 p-0">
              {featureHighlightContent.features.map((item) => (
                <li key={item.title} className="max-w-md">
                  <p className="text-subtitle font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-small leading-relaxed text-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative lg:pl-4">
            <div className="feature-highlight-animate">
              <div className="-translate-y-1 shadow-[0_28px_56px_-20px_rgba(0,0,0,0.22)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-22px_rgba(0,0,0,0.26)]">
                <FeatureHighlightVisual />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
