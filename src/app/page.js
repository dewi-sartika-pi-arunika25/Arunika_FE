// src/app/page.js
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import CTA from "@/components/CTA";
import PricingSection from "@/components/pricing/PricingSection";

export default function Page() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <PricingSection />
      <CTA />
    </main>
  );
}
