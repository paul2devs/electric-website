import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { termsOfServiceDocument } from "@/lib/content/legal-documents";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <LegalDocument
      label="Legal"
      title="Terms of"
      titleAccent="Service"
      updatedAt={termsOfServiceDocument.updatedAt}
      intro={termsOfServiceDocument.intro}
      sections={termsOfServiceDocument.sections}
    />
  );
}
