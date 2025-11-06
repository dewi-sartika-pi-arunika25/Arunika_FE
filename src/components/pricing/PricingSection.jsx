"use client";

import { motion } from "framer-motion";
import PlanCard from "./PlanCard";
import { plans } from "@/lib/pricing";
import FloatingIcons from "./FloatingIcons";
import { useApproachReveal } from "@/hooks/useMotionPresets";

export default function PricingSection() {
  const { ref, visible } = useApproachReveal({
    amount: 0.25,
    rootMargin: "-10% 0px -10% 0px",
  });

  return (
    <section id="keanggotaan">
      <div className="wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 14, filter: "blur(2px)" }}
          animate={{
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 12,
            filter: visible ? "blur(0px)" : "blur(2px)",
          }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          className="relative rounded-3xl px-0 py-10 sm:py-12 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #FFF6EF, color-mix(in oklab, #FFF6EF 90%, transparent))",
            border:
              "1px solid color-mix(in oklab, var(--accent-2) 42%, transparent)",
            boxShadow: "0 26px 60px rgba(0,0,0,.06)",
          }}
        >
          {/* Floating ikon kecil, interaktif */}
          <FloatingIcons className="opacity-70" count={22} icon="/icon.svg" />

          {/* Copy header — SATU BARIS & lebih kecil */}
          <div className="relative text-center max-w-4xl mx-auto px-6 sm:px-10">
            <span
              className="inline-block rounded-full px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-[0.22em]"
              style={{
                background:
                  "color-mix(in oklab, var(--accent-3) 48%, transparent)",
                color: "color-mix(in oklab, var(--text) 80%, transparent)",
              }}
            >
              KEANGGOTAAN
            </span>

            <h2
              className="mt-3 text-[28px] sm:text-[34px] md:text-[38px] font-extrabold tracking-tight leading-tight"
              style={{
                // hitam → orange halus
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--text) 95%, black), color-mix(in oklab, var(--primary) 65%, var(--text)))",
                WebkitBackgroundClip: "text",
                color: "transparent",
                whiteSpace: "nowrap", // satu baris
              }}
              title="Buka Level Baru Dalam Karirmu"
            >
              Buka Level Baru Dalam Karirmu
            </h2>

            <p
              className="mt-3 text-[15px] sm:text-[16px] md:text-[17px]"
              style={{ color: "color-mix(in oklab, var(--text) 75%, transparent)" }}
            >
              Pilih rencana yang mendukung petualangan karirmu. Kamu punya peta jalan yang
              tepat untukmu.
            </p>
          </div>

          {/* GRID KARTU — kartu ramping, sama lebar, tinggi cukup untuk copy */}
          <div className="relative mt-10 px-6 sm:px-10">
            <div className="mx-auto grid gap-6 sm:gap-7 md:grid-cols-2 max-w-5xl">
              {plans.map((p) => (
                <PlanCard
                  key={p.id}
                  {...p}
                  maxWidth="460px"   // kartu lebih ramping
                  minHeight="520px"  // lebih panjang agar napas
                  hoverGlow="orange"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
