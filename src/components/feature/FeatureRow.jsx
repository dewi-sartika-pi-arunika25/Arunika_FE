"use client";
import FeatureCard from "./FeatureCard";
import { featureItems } from "@/lib/features";

export default function FeatureRow() {
  return (
    <section className="section">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="section-title">Bukan Sekadar Tes, Tapi Strategi Karir Personalmu</h2>
        <p className="mt-4 text-neutral-700">
          Arunika dirancang untuk memberi kejelasan, bukan keraguan. Begini cara kami membantumu
          mencapai tujuan.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureItems.map((f) => (
          <FeatureCard key={f.id} {...f} />
        ))}
      </div>
    </section>
  );
}
