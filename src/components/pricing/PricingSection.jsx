"use client";

import PlanCard from "./PlanCard";
import { plans } from "@/lib/pricing";

export default function PricingSection() {
  return (
    <section className="section">
      <div className="pricing-container p-2">
        <div className="pricing-inner">
          <div className="grid lg:grid-cols-2 gap-10 p-8 sm:p-10">
            {/* Left copy */}
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Buka Level Baru Dalam Karirmu
              </h2>
              <p className="mt-3 pricing-copy">
                Pilih rencana yang mendukung petualangan karirmu. Kamu punya
                peta jalan yang tepat untukmu.
              </p>
            </div>

            {/* Right cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {plans.map((p) => (
                <PlanCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
