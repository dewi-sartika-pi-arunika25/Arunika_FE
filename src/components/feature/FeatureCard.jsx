"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Props:
 *  feature = {
 *    title, tag, imageSrc, alt, description,
 *    icon?: ReactNode  // optional, icon kecil untuk chip tag
 *  }
 *
 * Desain:
 * - Gambar “mengapung” di atas card dalam box rounded, overlap -mt.
 * - Chip tag + icon nempel di pojok kiri atas gambar, interaktif saat hover.
 * - Tipografi lebih rapat dan tidak kebesaran.
 */
const fadeUp = {
  hidden: { opacity: 0, y: 10, filter: "blur(2px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0)", transition: { duration: 0.28, ease: "easeOut" } },
};

export default function FeatureCard({ feature }) {
  const { title, tag, imageSrc, alt, description, icon } = feature || {};

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="
        relative flex h-full flex-col
        rounded-2xl border bg-white/92
        shadow-[0_8px_24px_rgba(0,0,0,.06)]
        transition-[transform,box-shadow,border-color,background] duration-200
        hover:shadow-[0_14px_36px_rgba(0,0,0,.10)]
      "
      style={{ borderColor: "var(--border)" }}
    >
      {/* Floating visual box */}
      <div className="relative -mt-8 px-4">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="
            relative mx-auto w-[88%]
            rounded-2xl overflow-hidden border bg-white
            shadow-[0_20px_40px_-18px_rgba(0,0,0,.18)]
          "
          style={{ borderColor: "color-mix(in oklab, var(--accent-3) 55%, var(--border))" }}
        >
          {/* chip tag + icon on image */}
          <motion.span
            whileHover={{ scale: 1.03 }}
            className="
              absolute left-3 top-3 z-10
              inline-flex items-center gap-1.5 rounded-full border
              px-2.75 py-1 text-[11px] font-semibold tracking-wide
              backdrop-blur-md
            "
            style={{
              color: "color-mix(in oklab, var(--text) 90%, transparent)",
              background: "color-mix(in oklab, var(--background) 65%, transparent)",
              borderColor: "color-mix(in oklab, var(--accent-2) 50%, transparent)",
            }}
          >
            {icon ? <span className="text-[14px]" aria-hidden>{icon}</span> : null}
            {tag}
          </motion.span>

          <div className="relative w-full aspect-[16/10]">
            <Image
              src={imageSrc}
              alt={alt || ""}
              fill
              className="object-cover"
              sizes="(min-width:1024px) 30vw, (min-width:768px) 40vw, 100vw"
              priority={false}
            />
            {/* subtle bottom vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.08))" }}
            />
          </div>
        </motion.div>

        {/* soft glow behind floating image */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-24 w-48 rounded-full blur-2xl"
          style={{ background: "color-mix(in oklab, var(--primary) 20%, transparent)" }}
        />
      </div>

      {/* body */}
      <div className="px-5 pt-6 pb-5">
        <h3
          className="text-[18px] sm:text-[20px] font-semibold leading-snug mb-1.5"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>
        <p
          className="text-[13.5px] sm:text-[14px] leading-[1.65]"
          style={{ color: "color-mix(in oklab, var(--text) 78%, transparent)" }}
        >
          {description}
        </p>
      </div>
    </motion.article>
  );
}
