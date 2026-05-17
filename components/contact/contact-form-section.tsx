"use client";

import { useContactForm } from "@/hooks/use-contact-form";
import { CONTACT_SERVICE_OPTIONS } from "@/lib/contact/service-options";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormSectionProps = {
  serviceName?: string;
  initialMessage?: string;
  initialServiceSlug?: string;
  topicHelp?: string | null;
};

const labelClass = "text-small font-medium text-ink";
const errorClass = "text-small text-error";

export function ContactFormSection({
  serviceName,
  initialMessage,
  initialServiceSlug,
  topicHelp,
}: ContactFormSectionProps) {
  const { values, errors, status, setField, submit } = useContactForm({
    serviceName,
    initialMessage,
    initialServiceSlug,
  });

  return (
    <section id="contact-form" className="border-b border-border section-gradient-muted">
      <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="max-w-md">
            <h2 className="text-subtitle font-semibold tracking-tight text-ink">Send a message</h2>
            <p className="mt-3 text-body leading-relaxed text-muted">
              Share your scope, location, and timing. We route your request to the right specialist
              and respond with clear next steps.
            </p>
            {topicHelp ? (
              <p className="mt-4 rounded-sm border border-border bg-surface px-4 py-3 text-small leading-relaxed text-ink">
                {topicHelp}
              </p>
            ) : null}
            {status === "success" ? (
              <p
                className="mt-4 rounded-sm border border-success/30 bg-success-muted px-4 py-3 text-small text-success"
                role="status"
              >
                Your email client should open with a pre-filled message. Send it to complete your
                enquiry.
              </p>
            ) : null}
          </div>

          <form
            className="border border-border bg-surface p-6 sm:p-8"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            {errors.form ? (
              <p
                className="mb-6 rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error"
                role="alert"
              >
                {errors.form}
              </p>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className={labelClass} htmlFor="contact-name">
                  Full name
                </label>
                <Input
                  autoComplete="name"
                  id="contact-name"
                  invalid={Boolean(errors.fullName)}
                  name="fullName"
                  onChange={(event) => setField("fullName", event.target.value)}
                  type="text"
                  value={values.fullName}
                />
                {errors.fullName ? (
                  <p className={cn(errorClass, "mt-1")} role="alert">
                    {errors.fullName}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="contact-email">
                  Email
                </label>
                <Input
                  autoComplete="email"
                  id="contact-email"
                  inputMode="email"
                  invalid={Boolean(errors.email)}
                  name="email"
                  onChange={(event) => setField("email", event.target.value)}
                  type="email"
                  value={values.email}
                />
                {errors.email ? (
                  <p className={cn(errorClass, "mt-1")} role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="contact-phone">
                  Phone
                </label>
                <Input
                  autoComplete="tel"
                  id="contact-phone"
                  inputMode="tel"
                  invalid={Boolean(errors.phone)}
                  name="phone"
                  onChange={(event) => setField("phone", event.target.value)}
                  type="tel"
                  value={values.phone}
                  placeholder="+234 801 234 5678"
                />
                {errors.phone ? (
                  <p className={cn(errorClass, "mt-1")} role="alert">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className={labelClass} htmlFor="contact-service">
                  Service needed
                </label>
                <select
                  id="contact-service"
                  name="serviceNeeded"
                  value={values.serviceNeeded}
                  onChange={(event) => setField("serviceNeeded", event.target.value)}
                  className={cn(
                    "h-11 w-full rounded-sm border border-border bg-surface px-3 text-body text-ink",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  )}
                >
                  {CONTACT_SERVICE_OPTIONS.map((option) => (
                    <option key={option.value || "empty"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className={labelClass} htmlFor="contact-message">
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  invalid={Boolean(errors.message)}
                  name="message"
                  onChange={(event) => setField("message", event.target.value)}
                  rows={5}
                  value={values.message}
                />
                {errors.message ? (
                  <p className={cn(errorClass, "mt-1")} role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="mt-8 w-full sm:w-auto"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Opening email…" : "Send message"}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
