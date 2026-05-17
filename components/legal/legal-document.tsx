import { Container } from "@/components/layout/container";
import { HeroTitle } from "@/components/ui/hero-title";
import { PageHero } from "@/components/ui/page-hero";
import type { LegalSection } from "@/lib/content/legal-documents";

type LegalDocumentProps = {
  label: string;
  title: string;
  titleAccent: string;
  updatedAt: string;
  intro: string;
  sections: readonly LegalSection[];
};

export function LegalDocument({
  label,
  title,
  titleAccent,
  updatedAt,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <>
      <PageHero
        label={label}
        variant="dark"
        align="center"
        title={<HeroTitle lead={title} accent={titleAccent} dark />}
        description={`Last updated ${updatedAt}.`}
      />
      <section className="border-b border-border bg-surface">
        <Container className="max-w-3xl px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
          <p className="text-body leading-relaxed text-muted">{intro}</p>
          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <article key={section.id} id={section.id}>
                <h2 className="text-subtitle font-semibold tracking-tight text-ink">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-body leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-muted">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
