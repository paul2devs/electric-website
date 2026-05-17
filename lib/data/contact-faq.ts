export type ContactFaqItem = {
  question: string;
  answer: string;
};

export const CONTACT_FAQ_ITEMS: readonly ContactFaqItem[] = [
  {
    question: "How fast can I get a technician?",
    answer: "Same-day or next-day availability for most programmes in Lagos, subject to scope and crew capacity.",
  },
  {
    question: "Do you provide estimates?",
    answer: "Yes. You receive a clear cost range before confirming your service through the booking flow.",
  },
  {
    question: "What areas do you cover?",
    answer: "Lagos and nearby regions. Nationwide projects are available by arrangement for larger scopes.",
  },
  {
    question: "Is emergency support available?",
    answer: "Yes. Use the emergency option on this page or book an emergency call-out for urgent electrical issues.",
  },
] as const;
