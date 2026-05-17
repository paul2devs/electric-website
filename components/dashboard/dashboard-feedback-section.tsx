"use client";

import { FeedbackForm } from "@/components/feedback/feedback-form";
import { SectionHeader } from "@/components/dashboard/section-header";
import { useAuth } from "@/hooks/use-auth";

export function DashboardFeedbackSection() {
  const { user } = useAuth();

  return (
    <section className="flex flex-col gap-4 rounded-sm border border-border bg-surface p-6">
      <SectionHeader
        title="Share feedback"
        subtitle="Tell us how your booking experience went or suggest improvements."
      />
      <FeedbackForm
        defaultName={user?.name}
        defaultEmail={user?.email}
        compact
      />
    </section>
  );
}
