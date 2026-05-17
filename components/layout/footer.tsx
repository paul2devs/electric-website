import Link from "next/link";

import { Container } from "@/components/layout/container";
import { IconFacebook, IconInstagram, IconTikTok, IconX } from "@/components/ui/social-icons";
import { brandName } from "@/lib/constants/navigation";
import {
  getContactEmailDisplay,
  getContactMailtoHref,
  getContactPhoneDisplay,
  getContactPhoneHref,
  getServiceHoursLine,
  getSocialLinks,
} from "@/lib/constants/site-contact";
import { siteFooterCompanyLinks, siteFooterLegalLinks } from "@/lib/constants/site-navigation";
import { FooterFeedbackSection } from "@/components/feedback/footer-feedback-section";
import { siteFooterBrand } from "@/lib/content/site-footer";
import { getFooterServiceLinks } from "@/lib/data/footer-services";
import { cn } from "@/lib/utils";

const columnTitleClass = "text-small font-semibold uppercase tracking-[0.14em] text-ink";
const linkClass =
  "text-small text-muted transition-colors duration-150 hover:text-ink";

function SocialIconFor({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l === "x") {
    return <IconX className="text-muted" />;
  }
  if (l === "instagram") {
    return <IconInstagram className="text-muted" />;
  }
  if (l === "tiktok") {
    return <IconTikTok className="text-muted" />;
  }
  if (l === "facebook") {
    return <IconFacebook className="text-muted" />;
  }
  return null;
}

export function Footer() {
  const year = new Date().getFullYear();
  const serviceLinks = getFooterServiceLinks();
  const socials = getSocialLinks();
  const phoneDisplay = getContactPhoneDisplay();
  const phoneHref = getContactPhoneHref();

  return (
    <footer className="border-t border-black/[0.06] bg-[#f7f7f7]">
      <FooterFeedbackSection />
      <Container className="px-8 pb-10 pt-20 sm:px-10 sm:pb-12 sm:pt-24 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          <div className="max-w-[17rem]">
            <p className="text-body font-semibold tracking-tight text-ink">
              {siteFooterBrand.name}
            </p>
            <p className="mt-4 text-small leading-relaxed text-muted">
              {siteFooterBrand.description}
            </p>
          </div>

          <div>
            <p className={columnTitleClass}>Services</p>
            <ul className="mt-5 flex list-none flex-col gap-3 p-0">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={columnTitleClass}>Company</p>
            <ul className="mt-5 flex list-none flex-col gap-3 p-0">
              {siteFooterCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={columnTitleClass}>Contact</p>
            <ul className="mt-5 flex list-none flex-col gap-4 p-0 text-small">
              <li>
                <span className="text-muted">Email</span>
                <br />
                <Link href={getContactMailtoHref()} className={cn(linkClass, "font-medium")}>
                  {getContactEmailDisplay()}
                </Link>
              </li>
              <li>
                <span className="text-muted">Phone</span>
                <br />
                <Link href={phoneHref} className={cn(linkClass, "font-medium")}>
                  {phoneDisplay ?? "Contact us"}
                </Link>
              </li>
              {socials.length > 0 ? (
                <li>
                  <span className="text-muted">Social</span>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {socials.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors duration-150 hover:text-ink"
                        aria-label={s.label}
                      >
                        <SocialIconFor label={s.label} />
                      </Link>
                    ))}
                  </div>
                </li>
              ) : null}
              <li className="text-small leading-relaxed text-muted">
                <span className="text-ink/70">Service hours</span>
                <br />
                {getServiceHoursLine()}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-black/[0.08] pt-8 sm:mt-20">
          <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
            {siteFooterLegalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-small text-muted">
            © {year} {brandName}
            <span className="mx-2 text-border">·</span>
            All rights reserved
          </p>
        </div>
      </Container>
    </footer>
  );
}
