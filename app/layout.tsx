import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/lib/auth/auth-context";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildPageMetadata,
  defaultDescription,
  organizationJsonLd,
  siteUrl,
} from "@/lib/seo/site-metadata";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Professional electrical services",
    description: defaultDescription,
    path: "/",
  }),
  metadataBase: new URL(siteUrl),
  applicationName: "Testimonydot",
  appleWebApp: {
    capable: true,
    title: "Testimonydot",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <JsonLd data={organizationJsonLd} />
        <AuthProvider>
          {children}
          <CookieConsentBanner />
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}
