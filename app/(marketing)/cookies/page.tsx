import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { cookiePolicyDocument } from "@/lib/content/legal-documents";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

export default function CookiesPage() {
  return (
    <LegalDocument
      label="Legal"
      title="Cookie"
      titleAccent="Policy"
      updatedAt={cookiePolicyDocument.updatedAt}
      intro={cookiePolicyDocument.intro}
      sections={cookiePolicyDocument.sections}
    />
  );
}
