"use client";

import { motion } from "framer-motion";
import Parallax from "@/components/hero/Parallax";

/**
 * HeroBase
 * - Background via `bgUrl` (letakkan di /public)
 * - Scrim lembut agar teks tetap kebaca tanpa panel
 * - Subtitle interaktif (hover: highlight + nudge)
 * - CTA ghost pakai `onClick` (cocok untuk modal)
 */
export default function HeroBase({
  eyebrow,
  title,
  subtitle,
  ctas = [],
  bgUrl,
  align = "left",
  rightSlot = null,        // opsional visual di kanan
}) {
  const alignText =
    align === "left" ? "text-left items-start" : "text-center items-center";

  // Gradients
  const bgWash =
    "linear-gradient(180deg, rgba(255,253,244,.92) 0%, rgba(255,253,244,.80) 36%, rgba(255,253,244,.58) 100%)";
  const studioGlow =
    "radial-gradient(50rem 28rem at 75% 35%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 70%), radial-gradient(38rem 22rem at 20% 20%, color-mix(in oklab, var(--accent-2) 22%, transparent), transparent 70%)";
  // Scrim lembut di kiri (supaya teks kebaca, tapi wallpaper tetap terlihat)
  const leftScrim =
    "linear-gradient(90deg, rgba(15,18,25,.30) 0%, rgba(15,18,25,.18) 42%, rgba(15,18,25,0) 76%)";

  return (
    <section
      id="hero"
      aria-label="Bagian pembuka"
      className="relative overflow-hidden rounded-2xl border shadow-sm"
    >
      {/* Background */}
      {bgUrl && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-center bg-cover"
            style={{ backgroundImage: `url(${bgUrl})`, backgroundColor: "var(--background)" }}
          />
          <div aria-hidden className="absolute inset-0 -z-20" style={{ background: bgWash }} />
        </>
      )}
      {/* Glow + Scrim */}
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: studioGlow }} />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-[66%] max-lg:w-full"
        style={{ background: leftScrim }}
      />

      {/* Content */}
      <Parallax speed={0.22} className="relative z-10">
        <div className="px-6 sm:px-10 md:px-14 lg:px-20 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] items-center gap-10 lg:gap-14">
            {/* LEFT: Copy */}
            <div className={`flex flex-col ${alignText} gap-4 max-w-2xl`}>
              {eyebrow && (
                <p className="uppercase tracking-[0.2em] text-xs sm:text-sm text-[var(--accent-2)]">
                  {eyebrow}
                </p>
              )}

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-[var(--text)] drop-shadow-sm">
                {title}
              </h1>

              {subtitle && (
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="text-base sm:text-lg leading-relaxed max-w-xl
                             text-[color:var(--text)]/90
                             hover:text-[color:var(--text)]
                             rounded-xl px-2 py-1 -mx-2
                             hover:bg-[color:var(--background)]/40 hover:backdrop-blur-[1px]
                             hover:ring hover:ring-[color:var(--accent-2)]/25 hover:shadow-sm cursor-default"
                >
                  {subtitle}
                </motion.p>
              )}

              {!!ctas.length && (
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  {ctas.map((c) =>
                    c.variant === "ghost" ? (
                      <button
                        key={c.label}
                        onClick={c.onClick}
                        className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium transition
                                   hover:bg-white/20"
                        style={{ borderColor: "var(--accent-2)", color: "var(--text)" }}
                      >
                        {c.label}
                      </button>
                    ) : (
                      <a
                        key={c.label}
                        href={c.href || "#"}
                        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg"
                        style={{
                          background:
                            "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black) 0%, var(--primary) 100%)",
                          boxShadow:
                            "0 14px 30px -12px color-mix(in oklab, var(--primary) 70%, black)",
                        }}
                      >
                        {c.label}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: Optional visual slot */}
            <div className="relative">{rightSlot}</div>
          </div>
        </div>
      </Parallax>

      {/* Decorative wave */}
      <svg
        aria-hidden
        className="absolute -bottom-px left-0 right-0 w-full h-10 sm:h-14 lg:h-16"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C180,20 360,20 540,60 C720,100 900,100 1080,60 C1260,20 1350,20 1440,60 L1440,100 L0,100 Z"
          fill="rgba(0,0,0,0.04)"
        />
      </svg>
    </section>
  );
}
