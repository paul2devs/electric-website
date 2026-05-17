export type SocialLink = {
  label: string;
  href: string;
};

function digitsOnly(value: string | undefined): string {
  return value?.replace(/\D/g, "") ?? "";
}

const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "testimonydot@gmail.com";

const phoneTel =
  digitsOnly(process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL) ||
  digitsOnly(process.env.NEXT_PUBLIC_CONTACT_PHONE) ||
  digitsOnly(process.env.NEXT_PUBLIC_WHATSAPP_E164) ||
  digitsOnly(process.env.NEXT_PUBLIC_WHATSAPP_PHONE) ||
  "2348000000000";

const phoneDisplay =
  process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY?.trim() ||
  (phoneTel.length >= 10 ? `+${phoneTel}` : "");

/** WhatsApp launcher — env overrides this fallback. */
export const SITE_WHATSAPP_E164 =
  digitsOnly(process.env.NEXT_PUBLIC_WHATSAPP_E164) ||
  digitsOnly(process.env.NEXT_PUBLIC_WHATSAPP_PHONE) ||
  phoneTel;

export const SITE_CONTACT_EMAIL = contactEmail;

export const siteContact = {
  email: contactEmail,
  phoneDisplay,
  phoneTel,
  hoursWeekday:
    process.env.NEXT_PUBLIC_SERVICE_HOURS_WEEKDAY?.trim() ||
    "Mon–Sat · 8:00–18:00 WAT",
  coverageLine:
    process.env.NEXT_PUBLIC_SERVICE_COVERAGE?.trim() ||
    "Lagos and surrounding areas · nationwide projects by arrangement",
} as const;

export function getContactEmail(): string {
  return siteContact.email;
}

export function getContactEmailDisplay(): string {
  return siteContact.email;
}

export function getContactMailtoHref(): string {
  return `mailto:${siteContact.email}`;
}

export function getContactPhoneDisplay(): string | null {
  return siteContact.phoneDisplay.length > 0 ? siteContact.phoneDisplay : null;
}

export function getContactPhoneHref(): string {
  if (siteContact.phoneTel.length >= 10) {
    return `tel:+${siteContact.phoneTel}`;
  }
  return getContactMailtoHref();
}

export function getServiceHoursLine(): string {
  return siteContact.hoursWeekday;
}

export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [];
  const x = process.env.NEXT_PUBLIC_SOCIAL_X_URL?.trim();
  const instagram = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL?.trim();
  const facebook = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL?.trim();
  const tiktok = process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL?.trim();

  if (x) {
    links.push({ label: "X", href: x });
  }
  if (instagram) {
    links.push({ label: "Instagram", href: instagram });
  }
  if (facebook) {
    links.push({ label: "Facebook", href: facebook });
  }
  if (tiktok) {
    links.push({ label: "TikTok", href: tiktok });
  }
  return links;
}
