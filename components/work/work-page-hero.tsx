import { HeroTitle } from "@/components/ui/hero-title";
import { PageHero } from "@/components/ui/page-hero";

export function WorkPageHero() {
  return (
    <PageHero
      label="Our work"
      variant="dark"
      title={<HeroTitle lead="Real projects." accent="Real results." dark />}
      description="Explore a selection of completed electrical work — from installations to advanced system setups across Lagos and surrounding areas."
    />
  );
}
