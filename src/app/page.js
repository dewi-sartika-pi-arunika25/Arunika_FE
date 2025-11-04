"use client";

import React, { Suspense, lazy } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LandingHero from "@/components/hero/LandingHero";

// Lazy load heavy sections for better initial load performance
const FeatureSection = lazy(() => import("@/components/feature/FeatureSection"));
const IntelligentDashboard = lazy(() => import("@/components/dashboard/IntelligentDashboard"));
const PricingSection = lazy(() => import("@/components/pricing/PricingSection"));
const AboutUsSection = lazy(() => import("@/components/about/AboutUsSection"));

// Loading fallback component
const SectionSkeleton = () => (
  <div className="py-16 sm:py-20 animate-pulse">
    <div className="wrap">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="h-12 bg-gray-200 rounded w-3/4 mb-6" />
      <div className="h-6 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        {/* Hero - load immediately (above the fold) */}
        <LandingHero />
        
        {/* Lazy load sections below the fold */}
        <Suspense fallback={<SectionSkeleton />}>
          <FeatureSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <IntelligentDashboard />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <PricingSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <AboutUsSection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
