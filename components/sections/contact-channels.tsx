import {
  getContactMailtoHref,
  siteContact,
} from "@/lib/constants/site-contact";

export function ContactChannels() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <p className="text-small font-medium text-muted uppercase tracking-wide">
          Email
        </p>
        <a
          className="mt-2 block text-body font-medium text-ink underline"
          href={getContactMailtoHref()}
        >
          {siteContact.email.length > 0 ? siteContact.email : "Contact form"}
        </a>
      </div>
      <div>
        <p className="text-small font-medium text-muted uppercase tracking-wide">
          Phone
        </p>
        <a
          className="mt-2 block text-body font-medium text-ink underline"
          href={
            siteContact.phoneTel.length > 0
              ? `tel:${siteContact.phoneTel}`
              : getContactMailtoHref()
          }
        >
          {siteContact.phoneDisplay.length > 0
            ? siteContact.phoneDisplay
            : "Request a callback"}
        </a>
      </div>
      <div className="sm:col-span-2 lg:col-span-1">
        <p className="text-small font-medium text-muted uppercase tracking-wide">
          Hours
        </p>
        <p className="mt-2 text-body text-muted leading-relaxed">
          {siteContact.hoursWeekday}
        </p>
        <p className="mt-4 text-small text-muted leading-relaxed">
          {siteContact.coverageLine}
        </p>
      </div>
    </div>
  );
}
