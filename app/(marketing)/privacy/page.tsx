import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { privacyPolicyDocument } from "@/lib/content/legal-documents";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      label="Legal"
      title="Privacy"
      titleAccent="Policy"
      updatedAt={privacyPolicyDocument.updatedAt}
      intro={privacyPolicyDocument.intro}
      sections={privacyPolicyDocument.sections}
    />
  );
}
