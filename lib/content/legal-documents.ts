export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const termsOfServiceDocument = {
  title: "Terms of Service",
  updatedAt: "16 May 2026",
  intro:
    "These Terms of Service govern your use of the Testimonydot platform and electrical services coordinated through it. By creating an account or booking a service, you agree to these terms.",
  sections: [
    {
      id: "services",
      title: "Services",
      paragraphs: [
        "Testimonydot coordinates licensed electrical work including installations, repairs, inspections, smart systems, and solar programmes. Scope, pricing, and timelines are confirmed before mobilisation.",
        "Estimates provided through the platform are indicative until site assessment is complete. Final pricing is confirmed in writing before work proceeds.",
      ],
    },
    {
      id: "bookings",
      title: "Bookings & cancellations",
      paragraphs: [
        "You are responsible for accurate contact details, site access information, and safety disclosures at the time of booking.",
        "Cancellations or reschedules should be requested as early as possible. Late cancellations may incur mobilisation fees where crews have already been assigned.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts",
      paragraphs: [
        "You must provide accurate registration information and keep credentials secure. You are responsible for activity under your account.",
        "We may suspend accounts that violate these terms, misuse the platform, or present safety or fraud risk.",
      ],
    },
    {
      id: "liability",
      title: "Liability",
      paragraphs: [
        "Work is performed to applicable Nigerian electrical standards and agreed scope. Our liability is limited to the extent permitted by applicable law for the services actually delivered under a confirmed booking.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Questions about these terms may be directed through the contact page or the operations email published on the site.",
      ],
    },
  ] satisfies readonly LegalSection[],
} as const;

export const privacyPolicyDocument = {
  title: "Privacy Policy",
  updatedAt: "16 May 2026",
  intro:
    "Testimonydot respects your privacy. This policy explains what information we collect, how we use it, and the choices available to you.",
  sections: [
    {
      id: "collect",
      title: "Information we collect",
      paragraphs: ["We collect information you provide directly and data generated when you use the platform."],
      bullets: [
        "Account details: name, email, phone number, and address",
        "Booking details: service selection, schedule, site notes, and communications",
        "Support messages sent through contact forms or email",
        "Technical data: device type, browser, and usage logs required to operate the service securely",
      ],
    },
    {
      id: "use",
      title: "How we use information",
      paragraphs: ["We use personal data to operate the platform and deliver services you request."],
      bullets: [
        "Process bookings, payments, and service coordination",
        "Send confirmations, schedule updates, and operational notices",
        "Improve platform reliability and prevent fraud or abuse",
        "Comply with legal obligations",
      ],
    },
    {
      id: "sharing",
      title: "Sharing",
      paragraphs: [
        "We do not sell personal data. Information is shared with assigned technicians and service partners only as needed to fulfil your booking, and with infrastructure providers that host our systems under appropriate safeguards.",
      ],
    },
    {
      id: "retention",
      title: "Retention",
      paragraphs: [
        "We retain account and booking records for as long as needed to provide services, resolve disputes, and meet regulatory requirements, then delete or anonymise data where appropriate.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        "You may request access, correction, or deletion of personal data by contacting operations. You may update profile details in your account settings where available.",
      ],
    },
  ] satisfies readonly LegalSection[],
} as const;

export const cookiePolicyDocument = {
  title: "Cookie Policy",
  updatedAt: "16 May 2026",
  intro:
    "This policy describes how Testimonydot uses cookies and similar technologies on our website.",
  sections: [
    {
      id: "what",
      title: "What are cookies",
      paragraphs: [
        "Cookies are small text files stored on your device. They help the site remember preferences, keep you signed in, and understand how the platform is used.",
      ],
    },
    {
      id: "essential",
      title: "Essential cookies",
      paragraphs: [
        "These cookies are required for the site to function. They include authentication session tokens, security protections, and your cookie consent choice.",
      ],
      bullets: [
        "Authentication and session management",
        "Cookie consent preference storage",
        "Booking draft storage in your browser (local storage)",
      ],
    },
    {
      id: "optional",
      title: "Optional cookies",
      paragraphs: [
        "If enabled in the future, analytics cookies would help us understand usage patterns. You may accept or reject optional cookies using the banner on first visit.",
      ],
    },
    {
      id: "manage",
      title: "Managing cookies",
      paragraphs: [
        "You can clear cookies through your browser settings. Rejecting optional cookies will not prevent you from using core booking and account features.",
      ],
    },
  ] satisfies readonly LegalSection[],
} as const;
