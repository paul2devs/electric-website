import { SITE_WHATSAPP_E164 } from "@/lib/constants/site-contact";

export function getWhatsAppDigits(): string | null {
  const raw = SITE_WHATSAPP_E164;
  if (!raw || raw.length < 10) {
    return null;
  }
  return raw;
}

export function getWhatsAppChatUrl(prefilledMessage: string): string | null {
  const digits = getWhatsAppDigits();
  if (!digits) {
    return null;
  }
  const params = new URLSearchParams();
  params.set("text", prefilledMessage);
  return `https://wa.me/${digits}?${params.toString()}`;
}
