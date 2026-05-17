import { FeedbackForm } from "@/components/feedback/feedback-form";
import { Container } from "@/components/layout/container";

export function FooterFeedbackSection() {
  return (
    <section className="border-t border-black/[0.06] bg-surface">
      <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-content gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.14em] text-muted">
              Feedback
            </p>
            <h2 className="font-display mt-3 text-title font-semibold tracking-[-0.03em] text-ink">
              Help us improve your experience
            </h2>
            <p className="mt-3 max-w-md text-small leading-relaxed text-muted">
              Share your experience, report an issue, or suggest improvements. Our operations team
              reviews every submission.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </Container>
    </section>
  );
}
