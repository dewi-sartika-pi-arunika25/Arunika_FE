"use client";

import { motion } from "framer-motion";

export default function FeatureCopy({ current }) {
  return (
    <div className="px-6 sm:px-8 pb-8 pt-6 text-center lg:text-left relative z-[1]">
      <h3
        className="text-[22px] sm:text-[24px] md:text-[26px] font-bold leading-tight tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {current.title}
      </h3>
      <p
        className="mx-auto lg:mx-0 mt-2 max-w-2xl text-[14.5px] sm:text-[15.5px] leading-relaxed"
        style={{ color: "color-mix(in oklab, var(--text) 78%, transparent)" }}
      >
        {current.description}
      </p>

      <div className="mt-4 flex justify-center lg:justify-start">
        <motion.a
          href="#unik"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            color: "var(--text)",
            borderColor: "color-mix(in oklab, var(--text) 35%, transparent)",
            background: "color-mix(in oklab, var(--background) 90%, transparent)",
          }}
        >
          Lihat contoh Insight
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
