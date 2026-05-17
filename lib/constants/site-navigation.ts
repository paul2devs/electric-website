import { routes } from "@/lib/constants/routes";

export const siteHeaderNav = [
  { label: "Home", href: routes.home },
  { label: "Services", href: routes.services },
  { label: "Our work", href: routes.ourWork },
  { label: "How it works", href: `${routes.home}#how-it-works` },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
] as const;

export const siteFooterCompanyLinks = [
  { label: "Our work", href: routes.ourWork },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
  { label: "How it works", href: `${routes.home}#how-it-works` },
  { label: "Book a service", href: routes.book },
] as const;

export const siteFooterLegalLinks = [
  { label: "Terms", href: routes.terms },
  { label: "Privacy", href: routes.privacy },
  { label: "Cookies", href: routes.cookies },
] as const;
