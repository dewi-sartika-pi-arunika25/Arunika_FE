"use client";

import { motion } from "framer-motion";
import PlanCard from "./PlanCard";
import { plans } from "@/lib/pricing";
import { useApproachReveal } from "@/hooks/useMotionPresets"; // ⬅️ in-view reveal

export default function PricingSection() {
  // Muncul saat section mendekat, hilang saat keluar area pantau
  const { ref, visible } = useApproachReveal({
    amount: 0.3,                     // ~30% elemen terlihat -> muncul
    rootMargin: "-12% 0px -12% 0px", // buffer atas & bawah biar smooth
  });

  return (
    // ⬇⬇ className="section" tetap ditiadakan agar patokan lebar pakai .wrap
    <section id="keanggotaan">
      <div className="wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 14, filter: "blur(2px)" }}
          animate={{
            opacity: visible ? 1 : 0,
            y:       visible ? 0 : 12,
            filter:  visible ? "blur(0px)" : "blur(2px)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-3xl px-0 py-10 sm:py-12 transition-[pointer-events] duration-200"
          style={{
            background:
              "linear-gradient(180deg, #FFF6EF, color-mix(in oklab, #FFF6EF 80%, transparent))",
            border: "1.5px solid color-mix(in oklab, var(--accent-2) 55%, transparent)",
            boxShadow: "0 26px 60px rgba(0,0,0,.08)",
            backdropFilter: "blur(10px) saturate(1.1)",
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          <div className="text-center max-w-3xl mx-auto px-6 sm:px-10">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "color-mix(in oklab, var(--accent-3) 48%, transparent)",
                color: "color-mix(in oklab, var(--text) 80%, transparent)",
              }}
            >
              Paket Arunika
            </span>
            <h2
              className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Harga yang Sesuai Langkahmu
            </h2>
            <p
              className="mt-3 text-sm sm:text-[15px]"
              style={{ color: "color-mix(in oklab, var(--text) 75%, transparent)" }}
            >
              Mulai gratis untuk eksplorasi awal. Naik ke paket tahunan saat kamu siap
              melangkah lebih jauh dengan analisis AI yang mendalam.
            </p>
          </div>

          {/* GRID KARTU — mengikuti lebar .wrap */}
          <div className="mt-10 px-6 sm:px-10">
            <div className="grid gap-8 sm:grid-cols-2">
              {plans.map((p) => (
                <PlanCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
