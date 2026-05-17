"use client";

import { useFeedbackForm } from "@/hooks/use-feedback-form";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FeedbackFormProps = {
  defaultName?: string;
  defaultEmail?: string;
  compact?: boolean;
  className?: string;
};

const labelClass = "text-small font-medium text-ink";
const errorClass = "text-small text-error";

export function FeedbackForm({
  defaultName,
  defaultEmail,
  compact = false,
  className,
}: FeedbackFormProps) {
  const { values, errors, status, setField, submit } = useFeedbackForm({
    defaultName,
    defaultEmail,
  });

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      {errors.form ? (
        <p className="rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error" role="alert">
          {errors.form}
        </p>
      ) : null}
      {status === "success" ? (
        <p className="rounded-sm border border-success/30 bg-success-muted px-3 py-2 text-small text-success" role="status">
          Thank you. Your feedback has been received by our operations team.
        </p>
      ) : null}
      {!compact ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="feedback-name">
              Name (optional)
            </label>
            <Input
              id="feedback-name"
              value={values.name}
              onChange={(event) => setField("name", event.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass} htmlFor="feedback-email">
              Email (optional)
            </label>
            <Input
              id="feedback-email"
              type="email"
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              autoComplete="email"
            />
            {errors.email ? <p className={errorClass}>{errors.email}</p> : null}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="feedback-message">
          Your feedback
        </label>
        <Textarea
          id="feedback-message"
          rows={compact ? 4 : 5}
          value={values.message}
          invalid={Boolean(errors.message)}
          onChange={(event) => setField("message", event.target.value)}
          placeholder="Share your experience, report an issue, or suggest an improvement."
        />
        {errors.message ? <p className={errorClass}>{errors.message}</p> : null}
      </div>
      <Button type="submit" variant="primary" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send feedback"}
      </Button>
    </form>
  );
}
