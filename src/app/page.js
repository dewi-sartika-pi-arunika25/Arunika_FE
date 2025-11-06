"use client";

import React, { Suspense, lazy, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle OAuth errors from Supabase that redirect to root
  useEffect(() => {
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    // If there's an OAuth error, redirect to login page
    if (error || errorCode || errorDescription) {
      console.log('🔍 OAuth error detected on landing page:', { error, errorCode, errorDescription });
      
      // Build error message
      const errorMsg = errorDescription || error || 'Authentication failed';
      
      // Redirect to login with error parameters
      const loginUrl = `/login?error=${encodeURIComponent(errorMsg)}${errorCode ? `&error_code=${errorCode}` : ''}`;
      console.log('🔗 Redirecting to login:', loginUrl);
      router.replace(loginUrl);
      return;
    }
  }, [searchParams, router]);

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

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
