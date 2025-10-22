"use client";

import PlanCard from "./PlanCard";
import { plans } from "@/lib/pricing";

export default function PricingSection() {
  return (
    <section className="section">
      {/* Container dengan border gradient halus (seperti screenshot lama) */}
      <div
        className="rounded-2xl sm:rounded-3xl p-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(162,89,255,.6), rgba(0,255,255,.35))",
        }}
      >
        <div className="rounded-2xl sm:rounded-3xl bg-white/75 backdrop-blur border">
          <div className="grid lg:grid-cols-2 gap-10 p-8 sm:p-10">
            {/* Left copy */}
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Buka Level Baru Dalam Karirmu
              </h2>
              <p className="mt-3 text-neutral-600">
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
