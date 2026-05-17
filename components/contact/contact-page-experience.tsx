import Link from "next/link";

import { HeroTitle } from "@/components/ui/hero-title";
import { PageHero } from "@/components/ui/page-hero";
import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

import { ContactFaq } from "./contact-faq";
import { ContactFinalCta } from "./contact-final-cta";
import { ContactFormSection } from "./contact-form-section";
import { ContactHours } from "./contact-hours";
import { ContactLocation } from "./contact-location";
import { ContactOptions } from "./contact-options";

type ContactPageExperienceProps = {
  topicHelp?: string | null;
  serviceName?: string;
  initialMessage?: string;
  initialServiceSlug?: string;
};

export function ContactPageExperience({
  topicHelp,
  serviceName,
  initialMessage,
  initialServiceSlug,
}: ContactPageExperienceProps) {
  return (
    <>
      <PageHero
        label="Contact"
        variant="dark"
        imageSrc="/marketing-contact.svg"
        imageAlt="Operations support"
        title={<HeroTitle lead="Get in touch," accent="we're here to help." dark />}
        description="Whether you need assistance choosing a service or have a question about your booking, our team is ready to assist."
      >
        <Link href="#contact-form" className={buttonClassName("onDark", "justify-center sm:w-auto w-full")}>
          Send a message
        </Link>
        <Link href={routes.book} className={buttonClassName("onDarkOutline", "justify-center sm:w-auto w-full")}>
          Book a service
        </Link>
      </PageHero>
      <ContactOptions />
      <ContactFormSection
        topicHelp={topicHelp}
        serviceName={serviceName}
        initialMessage={initialMessage}
        initialServiceSlug={initialServiceSlug}
      />
      <ContactLocation />
      <ContactHours />
      <ContactFaq />
      <ContactFinalCta />
    </>
  );
}
