import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntelligentDashboard from "@/components/dashboard/IntelligentDashboard";
import PricingSection from "@/components/pricing/PricingSection";
import AboutUsSection from "@/components/about/AboutUsSection";
import FeatureSection from "@/components/feature/FeatureSection";
import LandingHero from "@/components/hero/LandingHero";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10">
         <LandingHero />
        <FeatureSection />
        <IntelligentDashboard />
        <PricingSection />
        <AboutUsSection />
      </main>
      <Footer />
    </>
  );
}
