"use client";

import { useContactForm } from "@/hooks/use-contact-form";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  serviceName?: string;
  initialMessage?: string;
};

const labelClass = "text-small font-medium text-ink";
const errorClass = "text-small text-error";

export function ContactForm({ serviceName, initialMessage }: ContactFormProps) {
  const { values, errors, setField, submit } = useContactForm({ serviceName, initialMessage });

  return (
    <div className="rounded-sm border border-border bg-surface p-6 sm:p-8">
      <Heading level={2}>Send a message</Heading>
      <p className="mt-2 text-small text-muted leading-relaxed">
        Your email client will open with a pre-filled message you can edit
        before sending.
      </p>
      <form
        className="mt-8 flex flex-col gap-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {errors.form ? (
          <p className="rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error" role="alert">
            {errors.form}
          </p>
        ) : null}
        <div className="flex flex-col gap-2">
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
          <label className={labelClass} htmlFor="contact-message">
            Message <span className="font-normal text-muted">(optional)</span>
          </label>
          <Textarea
            id="contact-message"
            name="message"
            onChange={(event) => setField("message", event.target.value)}
            value={values.message}
          />
          {errors.message ? (
            <p className={cn(errorClass, "mt-1")} role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>
        <Button type="submit" variant="primary">
          Open email draft
        </Button>
      </form>
    </div>
  );
}
