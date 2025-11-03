"use client";

import { motion } from "framer-motion";
import FeatureRows from "./FeatureRow";

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
  show: { opacity: 1, y: 0, filter: "blur(0)", transition: { duration: 0.38, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function FeatureSection() {
  return (
    <section id="keunggulan" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.45 }}
          variants={stagger}
          className="mx-auto text-center"
          aria-labelledby="feature-title"
        >
          <motion.p
            variants={fadeUp}
            className="mx-auto inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.22em] shadow-sm border"
            style={{
              color: "var(--accent-2)",
              borderColor: "color-mix(in oklab, var(--accent-2) 45%, transparent)",
              background: "color-mix(in oklab, var(--accent-3) 22%, transparent)",
            }}
          >
            KEUNGGULAN
          </motion.p>

          <motion.h2
            id="feature-title"
            variants={fadeUp}
            className="mx-auto mt-3 sm:mt-4 font-extrabold leading-tight
                       text-[30px] sm:text-[38px] md:text-[46px] lg:text-[50px] max-w-none"
            style={{
              backgroundImage:
                "linear-gradient(90deg, color-mix(in oklab, var(--text) 96%, transparent), color-mix(in oklab, var(--primary) 68%, var(--text)))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Temukan Peran yang Cocok, Bangun Masa Depan yang Kamu Mau
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-none text-[16px] sm:text-[18px] md:text-[19px]
                       leading-relaxed text-[color:var(--text)]/78 hover:text-[color:var(--text)] transition"
            tabIndex={0}
          >
            Bukan sekadar alat bantu, Arunika adalah strategi karier yang mengenali potensimu dan
            menghubungkan keterampilanmu dengan peluang nyata, sehingga kamu melangkah lebih percaya diri.
          </motion.p>
        </motion.div>

        <FeatureRows />
      </div>
    </section>
  );
}
