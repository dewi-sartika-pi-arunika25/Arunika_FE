import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FeatureRow from "@/components/feature/FeatureRow";
import IntelligentDashboard from "@/app/components/IntelligentDashboard";

import PricingSection from '../components/pricing/PricingSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <Hero />
        <FeatureRow /> 
         <IntelligentDashboard />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}


