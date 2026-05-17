import { Container } from "@/components/layout/container";
import { CONTACT_FAQ_ITEMS } from "@/lib/data/contact-faq";

export function ContactFaq() {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
        <h2 className="text-subtitle font-semibold tracking-tight text-ink">Quick answers</h2>
        <ul className="mt-8 divide-y divide-border">
          {CONTACT_FAQ_ITEMS.map((item) => (
            <li key={item.question} className="py-6 first:pt-0">
              <p className="text-body font-semibold text-ink">{item.question}</p>
              <p className="mt-2 text-body leading-relaxed text-muted">{item.answer}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
