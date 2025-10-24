import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import IntelligentDashboard from "@/app/components/IntelligentDashboard";
import PricingSection from "../components/pricing/PricingSection";
import AboutUsSection from "@/components/about/AboutUsSection";
import FeatureSection from "./components/FeatureSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <Hero />
        <FeatureSection />
        <IntelligentDashboard />
        <PricingSection />
        <AboutUsSection />
      </main>
      <Footer />
    </>
  );
}
