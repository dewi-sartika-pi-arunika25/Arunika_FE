"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBadge from "./AnimatedBadge";

export default function PlanCard({
  name,
  price,
  cadence,
  features = [],           // [{ label: string, on: boolean }]
  cta = "Pilih Paket",
  highlighted = false,     // untuk paket Tahunan
  badge,                   // { label: string, tone?: "free" | "pro" }
  maxWidth = "520px",
  hoverGlow = false,       // "orange" | false
}) {
  const [hover, setHover] = useState(false);
  const primary = "var(--primary)";
  const text = "var(--text)";

  // palet glow oranye agar nyambung
  const glowBg =
    hoverGlow === "orange"
      ? "radial-gradient(40% 38% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent)," +
        "radial-gradient(80% 70% at 50% 100%, color-mix(in oklab, var(--accent-2) 24%, transparent), transparent)"
      : "none";

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ y: -4, scale: 1.05 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="relative h-full w-full rounded-2xl p-[1.5px] group"
      style={{
        maxWidth,
        background:
          "linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.35))",
        border: "1px solid color-mix(in oklab, var(--accent-2) 42%, transparent)",
        boxShadow: hover
          ? "0 26px 80px rgba(255,131,0,.20), 0 10px 36px rgba(228,178,0,.18)"
          : "0 18px 44px rgba(0,0,0,.08)",
      }}
    >
      {/* ORANGE GLOW */}
      {hoverGlow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-[24px] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-200"
          style={{ background: glowBg }}
        />
      )}

      {badge?.label && (
        <div className="absolute -top-3 left-4 z-10">
          <AnimatedBadge label={badge.label} tone={badge.tone} />
        </div>
      )}

      <div
        className="relative flex h-full flex-col rounded-[16px] p-6 sm:p-7 bg-white"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.9))",
          border: `1px solid ${
            highlighted
              ? "color-mix(in oklab, var(--primary) 45%, transparent)"
              : "color-mix(in oklab, var(--accent-2) 25%, transparent)"
          }`,
        }}
      >
        {/* HEADER */}
        <h3
          className="text-lg font-semibold"
          style={{ color: highlighted ? primary : text }}
        >
          {name}
        </h3>

        <div className="mt-2 flex items-end gap-2">
          <div className="text-4xl font-extrabold" style={{ color: text }}>
            {price}
          </div>
          <div
            className="pb-1 text-sm"
            style={{ color: "color-mix(in oklab, var(--text) 70%, transparent)" }}
          >
            {cadence}
          </div>
        </div>

        {/* FEATURES */}
        <ul className="mt-5 space-y-3 text-sm">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg
                className="mt-[2px] h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={{
                  color: f.on
                    ? "var(--accent-2)"
                    : "color-mix(in oklab, var(--text) 40%, transparent)",
                }}
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span
                style={{
                  color: f.on
                    ? text
                    : "color-mix(in oklab, var(--text) 55%, transparent)",
                  opacity: f.on ? 1 : 0.6,
                }}
              >
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition"
          style={
            highlighted
              ? {
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
                  boxShadow: hover
                    ? "0 16px 36px -12px color-mix(in oklab, var(--primary) 70%, black)"
                    : "none",
                }
              : {
                  color: primary,
                  border: `1px solid ${primary}`,
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--accent-3) 40%, transparent), transparent)",
                }
          }
        >
          {cta}
        </motion.button>
      </div>
    </motion.div>
  );
}
