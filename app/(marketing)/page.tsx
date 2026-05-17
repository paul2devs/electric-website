import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { EmergencySection } from "@/components/sections/emergency-section";
import { FeatureHighlightSection } from "@/components/sections/feature-highlight-section";
import { FinalCTASection } from "@/components/sections/final-cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ServicesList } from "@/components/sections/services-list";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { TrustStrip } from "@/components/sections/trust-strip";
import { WhyChooseUs } from "@/components/sections/why-choose-us";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ServicesList />
      <WhyChooseUs />
      <HowItWorks />
      <FeatureHighlightSection />
      <SocialProofSection />
      <EmergencySection />
      <AboutPreviewSection />
      <FinalCTASection />
    </>
  );
}
