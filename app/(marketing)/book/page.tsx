import type { Metadata } from "next";
import { Suspense } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { BookingFlow } from "@/components/booking/booking-flow";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a service",
  description: "Schedule licensed electrical work with live availability and transparent pricing.",
  path: "/book",
  noIndex: true,
});

export default function BookPage() {
  return (
    <RequireAuth>
      <Section spacing="default" className="bg-[#fafafa]">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <header className="mb-10 max-w-2xl">
            <Heading level={1}>Book a service</Heading>
            <p className="mt-4 text-body leading-relaxed text-muted">
              A guided four-step flow — select your programme, lock a time, share details, and
              confirm. Your progress is saved automatically.
            </p>
          </header>
          <Suspense fallback={<p className="text-small text-muted">Loading booking…</p>}>
            <BookingFlow />
          </Suspense>
        </Container>
      </Section>
    </RequireAuth>
  );
}
