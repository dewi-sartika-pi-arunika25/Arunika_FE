"use client";

import { motion } from "framer-motion";
import FeatureShowcase from "./FeatureShowcase";

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
  show:   { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.38, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function FeatureSection() {
  return (
    <section id="keunggulan" className="py-16 sm:py-20">
      {/* samakan lebar dengan section lain */}
      <div className="wrap">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.45 }}
          variants={stagger}
          className="mx-auto text-center"
          aria-labelledby="feature-title"
        >
          {/* label kecil di atas title */}
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

          {/* TITLE: ikuti gaya “Arunika Insight” */}
          <motion.h2
            id="feature-title"
            variants={fadeUp}
            className="mx-auto mt-3 sm:mt-4 font-extrabold leading-[1.15]
                       text-[28px] sm:text-[34px] md:text-[40px]"
            style={{ color: "var(--text)" }}
          >
            Temukan Peran yang Cocok,&nbsp;
            <span style={{ color: "var(--primary)" }}>
              Bangun Masa Depan
            </span>{" "}
            yang Kamu Mau
          </motion.h2>

          {/* PARAGRAPH: ikuti skala & warna Insight */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl sm:max-w-2xl text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed"
            style={{ color: "color-mix(in oklab, var(--text) 82%, transparent)" }}
          >
            Arunika mengenali potensimu dan menghubungkannya dengan peluang nyata,
            sehingga kamu melangkah lebih percaya diri.
          </motion.p>
        </motion.div>

        {/* showcase */}
        <div className="mt-10 sm:mt-12">
          <FeatureShowcase />
        </div>
      </div>
    </section>
  );
}
