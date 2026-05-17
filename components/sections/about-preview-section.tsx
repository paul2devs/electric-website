import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { aboutPreviewContent } from "@/lib/content/home-marketing";
import { routes } from "@/lib/constants/routes";

export function AboutPreviewSection() {
  return (
    <Section spacing="default" className="border-b border-border bg-white">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-muted">
              {aboutPreviewContent.label}
            </p>
            <Heading level={2} className="mt-4">
              {aboutPreviewContent.heading}
            </Heading>
            <p className="mt-5 text-body leading-relaxed text-muted">
              {aboutPreviewContent.description}
            </p>
            <ul className="mt-8 flex list-none flex-col gap-3 border-t border-border pt-8 p-0">
              {aboutPreviewContent.credibility.map((line) => (
                <li key={line} className="text-small font-medium text-ink sm:text-body">
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href={routes.about}
              className="link-accent mt-10 inline-flex text-body font-medium"
            >
              {aboutPreviewContent.ctaLabel} →
            </Link>
          </div>
          <div className="relative isolate -translate-y-0.5 overflow-hidden rounded-2xl border border-border shadow-[0_28px_56px_-24px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_32px_64px_-24px_rgba(0,0,0,0.24)]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[5/4]">
              <Image
                src={aboutPreviewContent.imageSrc}
                alt={aboutPreviewContent.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/45" aria-hidden />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
